import { saveAs } from "file-saver"
import { makeAutoObservable } from "mobx"

import type { Installer } from "./installer"

export type InstallerUIStage =
    | "onboarding"
    | "fileaccess"
    | "install"
    | "complete"

export class InstallerUI {
    readonly installer: Installer
    stage: InstallerUIStage = "onboarding"
    alert?: string = undefined
    isCompatible?: boolean = undefined

    get isComplete(): boolean {
        return this.stage === "complete"
    }

    constructor(installer: Installer) {
        this.installer = installer
        makeAutoObservable(this)
    }

    setStage(stage: InstallerUIStage, clearAlert = true) {
        this.stage = stage
        if (clearAlert) {
            this.setAlert(undefined)
        }
    }

    setAlert(alert?: string) {
        this.alert = alert
    }

    checkCompatibility() {
        this.isCompatible = "FileSystemHandle" in window

        if (navigator.userAgent.indexOf("Firefox") > -1) {
            this.isCompatible = false
        }

        if (!this.isCompatible) {
            this.setAlert(
                "Your browser is not supported. Please refer to the manual installation guide.",
            )
        }
    }

    proceed(clearAlert = true) {
        switch (this.stage) {
            case "onboarding":
                this.stage = "fileaccess"
                break
            case "fileaccess":
                this.stage = "install"
                break
            case "install":
                this.stage = "complete"
                break
        }
        if (clearAlert) {
            this.setAlert(undefined)
        }
    }

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

    handleDump() {
        const dump = JSON.stringify(this.installer.createDump())
        const time = new Date().toISOString()

        saveAs(new Blob([dump]), `innit-installer-${time}.json`)
    }

    async install() {
        try {
            await this.installer.install()
            if (this.installer.state === "installed") {
                this.proceed()
            } else {
                this.setAlert("Installation failed. Try again?")
            }
        } catch (e) {
            // This should never happen
            console.error(e)
        }
    }
}
