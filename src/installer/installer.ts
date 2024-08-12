import { makeAutoObservable } from "mobx"

import type { Profile } from "../profile"

import { installFabric } from "./loader/fabric"
import { installVanilla } from "./loader/vanilla"
import { Logger } from "./logger"
import { createServersNBT } from "./nbt"
import { InstallerComponentState, InstallerProgress } from "./progress"
import { InstallerModState } from "./state"

/** Manages the lifecycle of a certain profile's installation. */
export class Installer {
    private _state: InstallerComponentState = "pending"
    private _mods?: InstallerModState[]
    private _handle?: FileSystemDirectoryHandle

    readonly progress = new InstallerProgress()
    readonly logger = new Logger()
    readonly profile: Profile

    /** The current state of the installer. */
    get state() {
        return this._state
    }

    /** A list of mods available to the installer. */
    get mods() {
        return this._mods
    }

    /** The file system directory handle. */
    get handle() {
        return this._handle
    }

    constructor(profile: Profile) {
        this.profile = profile
        this._mods = profile.mods.map((mod) => new InstallerModState(mod))
        makeAutoObservable(this, {
            logger: false,
            createDump: false,
        })
    }

    /** Sets the current installer state. */
    setState(state: InstallerComponentState) {
        this._state = state
    }

    /** Sets the handler. */
    setHandle(handle: FileSystemDirectoryHandle) {
        this._handle = handle
    }

    /** Completes the installation process of the `profile`. */
    async install(): Promise<void> {
        this.logger.info("preparing to install")
        this.setState("installing")
        this.progress.setDisplay("Preparing")

        // Prepare, Mod loader, Profile, Mods, Files, Complete
        const modCount = this.mods.length
        this.progress.setMax(5 + modCount)

        try {
            const id = `nox-${this.profile.id}`
            const instanceHandle = await this.handle.getDirectoryHandle(id, {
                create: true,
            })

            // Clean existing mods
            try {
                await instanceHandle.removeEntry("mods", { recursive: true })
            } catch (_) {}

            // Copy existing options
            try {
                this.logger.info("copying options")
                const optionsHandle = await instanceHandle.getFileHandle(
                    "options.txt",
                    { create: true },
                )
                const file = await optionsHandle.getFile()

                if (file.size === 0) {
                    const originalOptionsHandle =
                        await this.handle.getFileHandle("options.txt")
                    const originalFile = await originalOptionsHandle.getFile()
                    const options = await originalFile.text()

                    // The file shouldn't exist anyways...
                    const writable = await optionsHandle.createWritable({
                        keepExistingData: false,
                    })
                    try {
                        await writable.write(options)
                    } finally {
                        await writable.close()
                    }
                }
            } catch (error) {
                this.logger.error("failed to copy options", { error })
            }

            this.progress.incrementValue()

            // Install the mod loader
            this.progress.setDisplay("Installing mod loader")
            if (this.profile.version.loader === "fabric") {
                await installFabric(this)
            } else {
                await installVanilla(this)
            }

            this.progress.incrementValue()
            const modsHandle = await instanceHandle.getDirectoryHandle("mods", {
                create: true,
            })

            let installedModsCount = 0 // Initialize a counter for successfully installed mods

            // Create promises to download and correctly place each enabled mod
            const installPromises = this.mods.map((mod) => {
                if (!mod.include) return Promise.resolve()

                this.logger.info("installing mod", { ...mod.mod })
                mod.setState("installing")

                return (async () => {
                    try {
                        const modHandle = await modsHandle.getFileHandle(
                            mod.mod.path,
                            {
                                create: true,
                            },
                        )
                        const writable = await modHandle.createWritable({
                            keepExistingData: false,
                        })

                        try {
                            const res = await this.fetchWithRetry(mod.mod.url)
                            const reader = res.body.getReader()

                            while (true) {
                                const { done, value } = await reader.read()
                                if (value) {
                                    await writable.write(value)
                                }

                                if (done) break
                            }
                        } finally {
                            await writable.close()
                        }

                        mod.setState("installed")
                        installedModsCount++ // Increment the count after successful installation
                        this.progress.setDisplay(
                            `Installing mods [${installedModsCount}/${modCount}]`,
                        )
                        this.progress.incrementValue()
                    } catch (error) {
                        mod.setState("failed")
                        this.logger.error("unable to install mod", {
                            mod: mod.mod,
                            error,
                        })
                        if (mod.mod.option === "required") {
                            this.setState("failed")
                            throw error
                        }
                    }
                })()
            })

            try {
                await Promise.all(installPromises)
            } catch (error) {
                this.logger.error("installer failed", { error })
                this.setState("failed")
                return
            }

            this.logger.info("installing files")
            this.progress.incrementValue()
            this.progress.setDisplay("Installing files")
            if (this.profile.files) {
                for (const [path, url] of Object.entries(this.profile.files)) {
                    try {
                        this.logger.info("installing file", { path, url })
                        await this.installFile(instanceHandle, path, url)
                    } catch (error) {
                        this.logger.error("unable to install file", {
                            path,
                            url,
                        })
                        this.setState("failed")
                        return
                    }
                }
            }

            this.logger.info("creating launcher profile")
            this.progress.incrementValue()
            this.progress.setDisplay("Creating launcher profile")

            // Create the launcher profile
            const serversHandle = await instanceHandle.getFileHandle(
                "servers.dat",
                {
                    create: true,
                },
            )
            const serversWritable = await serversHandle.createWritable({
                keepExistingData: false,
            })
            const serversFile = await serversHandle.getFile()
            const serversBuffer = await serversFile.arrayBuffer()

            const serversNBT = await createServersNBT(
                this.profile,
                Buffer.from(serversBuffer),
            )

            try {
                await serversWritable.write(serversNBT.buffer)
            } finally {
                await serversWritable.close()
            }

            // Download a logo for the profile (or default to the Furnace)
            const logoBlob = await this.fetchWithRetry(this.profile.icon)
                .then((res) => res.arrayBuffer())
                .then(
                    (buf) =>
                        "data:image/png;base64," +
                        Buffer.from(buf).toString("base64"),
                )
                .catch(() => undefined)

            // Adjust the launcher profile to include custom java args, logos, etc
            const profilesHandle = await this.handle.getFileHandle(
                "launcher_profiles.json",
            )
            const profilesFile = await profilesHandle.getFile()
            const profiles = JSON.parse(await profilesFile.text())
            const isoTime = new Date().toISOString()
            profiles["profiles"][id] = {
                created: isoTime,
                icon: logoBlob ?? "Furnace",
                lastUsed: isoTime,
                lastVersionId: id,
                name: this.profile.name,
                type: "custom",
                javaArgs:
                    this.profile.javaArgs ??
                    "-Xmx2G -XX:+UseZGC -XX:+ZGenerational", // default java args
            }
            const writable = await profilesHandle.createWritable()
            try {
                await writable.write(JSON.stringify(profiles))
            } finally {
                await writable.close()
            }

            this.logger.info("installation complete")
            this.progress.incrementValue()
            this.progress.setDisplay("Installation complete")

            this.setState("installed")
        } catch (error) {
            this.logger.error("installer failed", { error })
            this.setState("failed")
        }
    }

    /** Downloads file from `url` and places at `path`. */
    async installFile(
        instanceHandle: FileSystemDirectoryHandle,
        path: string,
        url: string,
    ): Promise<void> {
        const segments = path.split("/")
        let root = instanceHandle

        if (segments.length > 1) {
            for (let i = 0; i < segments.length - 1; i++) {
                root = await root.getDirectoryHandle(segments[i], {
                    create: true,
                })
            }
        }

        const fileHandle = await root.getFileHandle(
            segments[segments.length - 1],
            {
                create: true,
            },
        )
        const writable = await fileHandle.createWritable({
            keepExistingData: false,
        })
        try {
            const res = await this.fetchWithRetry(url)
            const reader = res.body.getReader()

            while (true) {
                const { done, value } = await reader.read()
                if (value) {
                    await writable.write(value)
                }

                if (done) break
            }
        } finally {
            await writable.close()
        }
    }

    /** Fetches data from `input`, allowing for retries if the requests fails. */
    async fetchWithRetry(
        input: RequestInfo | URL,
        init?: RequestInit,
    ): Promise<Response> {
        for (let i = 0; i < 3; i++) {
            try {
                const res = await fetch(input, init)
                if (res.ok) return res
            } catch (error) {
                // If this is the last attempt, rethrow
                if (i == 2) throw error

                this.logger.error(
                    `fetch failed (attempt: #${i + 1}), retrying...`,
                    {
                        input,
                        error,
                    },
                )
            }
        }
    }

    /** Creates a dump of information, used to debug failed installations. */
    createDump(): any {
        return {
            installer: {
                logs: this.logger.entries,
                profile: {
                    ...this.profile,
                    mods: undefined,
                },
                mods: this.mods.map((mod) => ({
                    mod: mod.mod,
                    state: mod.state,
                    include: mod.include,
                })),
            },
            platform: {
                userAgent: navigator.userAgent,
            },
        }
    }
}
