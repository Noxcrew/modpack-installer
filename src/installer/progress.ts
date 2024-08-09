import { makeAutoObservable } from "mobx"

/** The current state of the installer. */
export type InstallerComponentState =
    | "pending"
    | "installing"
    | "installed"
    | "failed"

/** Stores and manages the progress of the profile installer. */
export class InstallerProgress {
    private _display = "Idle"
    private _value = 0
    private _max = 1

    /** The long-form status text to display. */
    get display() {
        return this._display
    }

    /** The current progress of the installer as a decimal between 0 and 1. */
    get progress(): number {
        return this._value / this._max
    }

    constructor() {
        makeAutoObservable(this)
    }

    /** Sets the installer display text. */
    setDisplay(display: string) {
        this._display = display
    }

    /** Sets the maximum count of steps to take. */
    setMax(max: number) {
        this._max = max
    }

    /** Increments the current step. */
    incrementValue() {
        this._value++
    }
}
