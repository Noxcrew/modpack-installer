import { saveAs } from "file-saver"
import { makeAutoObservable } from "mobx"

import type { Installer } from "./installer"

/** The current state of the installation, as represented in the UI. */
export type InstallerUIStage =
    | "onboarding"
    | "fileaccess"
    | "install"
    | "complete"
    | "up-to-date"
    | "fresh"

/** Manages the lifecycle of the installation UI. */
export class InstallerUI {
    readonly installer: Installer

    private _stage: InstallerUIStage = "onboarding"
    private _alert?: string = undefined
    private _isCompatible?: boolean = undefined

    /** The current installation stage. */
    get stage() {
        return this._stage
    }

    /** An alert to highlight. */
    get alert() {
        return this._alert
    }

    /** Whether the user's environment is compatible with the `FileSystemHandle` API. */
    get isCompatible() {
        return this._isCompatible
    }

    /** Whether the installation is complete. */
    get isComplete() {
        return this.stage === "complete"
    }

    constructor(installer: Installer) {
        this.installer = installer
        makeAutoObservable(this)
    }

    /** Sets the current installation stage. */
    setStage(stage: InstallerUIStage, clearAlert = true) {
        this._stage = stage

        if (clearAlert) {
            this.setAlert(undefined)
        }

        if (stage === "fresh") {
            this.installer.setFresh(true)
        }
    }

    /** Sets the current alert. */
    setAlert(alert?: string) {
        this._alert = alert
    }

    /** Checks for `FileSystemHandle` compatibility in the user's environment. */
    checkCompatibility() {
        this._isCompatible = "FileSystemHandle" in window

        if (navigator.userAgent.indexOf("Firefox") > -1) {
            this._isCompatible = false
        }

        if (!this.isCompatible) {
            this.setAlert(
                "Your browser is not supported. Please refer to the manual installation guide.",
            )
        }
    }

    /** Proceeds to the next UI stage. */
    proceed(clearAlert = true) {
        switch (this.stage) {
            case "onboarding":
                this._stage = "fileaccess"
                break
            case "fresh":
                this._stage = "fileaccess"
                break
            case "fileaccess":
                this._stage = "install"
                break
            case "install":
                this._stage = "complete"
                break
        }
        if (clearAlert) {
            this.setAlert(undefined)
        }
    }

    /** Handles the dropping of a file/directory on the page's viewport. */
    async handleDrop(handle: FileSystemHandle): Promise<void> {
        try {
            if (handle.kind !== "directory") {
                this.setAlert("This is not a folder!")
                return
            }

            const directoryHandle = handle as FileSystemDirectoryHandle

            try {
                await directoryHandle.getFileHandle("launcher_profiles.json")
                const permission = await directoryHandle.requestPermission({
                    mode: "readwrite",
                })
                if (permission === "denied") {
                    this.setAlert("Please grant us write permissions.")
                    return
                }
                this.installer.setHandle(directoryHandle)
                this.setStage("install")
                this.install()
            } catch (e) {
                this.setAlert(
                    "Oops! This does not seem like a Minecraft folder.",
                )
            }
        } catch (e) {
            console.error(e)
            this.setAlert("That didn't work. Try again?")
        }
    }

    /** Handles the creation of a dump file. */
    handleDump() {
        const dump = JSON.stringify(this.installer.createDump())
        const time = new Date().toISOString()

        saveAs(new Blob([dump]), `nox-installer-${time}.json`)
    }

    /** Attempts to install the profile. */
    async install() {
        try {
            await this.installer.install()
            if (this.installer.state === "installed") {
                this.proceed()
            } else if (this.installer.state === "up-to-date") {
                this.setStage("up-to-date")

                // Reset the installer's progress in case the user reinstalls fresh mods
                this.installer.progress.reset()
            } else {
                this.setAlert("Installation failed. Try again?")
            }
        } catch (e) {
            // This should never happen
            console.error(e)
        }
    }
}
