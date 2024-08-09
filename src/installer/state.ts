import { makeAutoObservable } from "mobx"
import { ProfileMod } from "../profile"
import { InstallerComponentState } from "./progress"

/** The state of an individual mod in the installer. */
export class InstallerModState {
    readonly mod: ProfileMod
    _state: InstallerComponentState = "pending"
    include: boolean

    /** The current install state of the mod. */
    get state() {
        return this._state
    }

    constructor(mod: ProfileMod) {
        this.mod = mod
        this.include = mod.option !== "optional"
        makeAutoObservable(this)
    }

    /** Sets the current install state of the mod. */
    setState(state: InstallerComponentState) {
        this._state = state
    }

    /** Toggles whether to include this mod in the installation. */
    toggle() {
        this.include = !this.include
    }
}
