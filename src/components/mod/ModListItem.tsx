"use client"

import { InstallerModState } from "@/src/installer/state"
import clsx from "clsx"
import { observer } from "mobx-react-lite"
import Switch from "../Switch"

interface Props {
    progress?: boolean
    mod: InstallerModState
    onToggle(): void
}

export const ModListItem = observer((props: Props) => {
    const { progress, mod, onToggle } = props

    const mapStateLabel = (): string => {
        if (!mod.include) {
            return "Skipped"
        }

        switch (mod.state) {
            case "pending":
                return "Pending"
            case "installing":
                return "Installing"
            case "installed":
                return "Installed"
            case "failed":
                return "Failed"
        }
    }

    const mapStateStyle = (): string => {
        if (!mod.include) {
            // Skipped
            return "bg-green-500/20 text-green-500"
        }

        switch (mod.state) {
            case "pending":
            case "installing":
                return "bg-yellow-500/20 text-yellow-500"
            case "installed":
                return "bg-green-500/20 text-green-500"
            case "failed":
                return "bg-red-500/20 text-red-500"
        }
    }

    return (
        <li className="px-4 py-3 flex flex-row items-center">
            <div className="text-neutral-200 grow relative group">
                <h3>{mod.mod.name}</h3>
                <p className="text-xs">{mod.mod.description}</p>
            </div>

            {!progress && (
                <Switch
                    value={mod.include}
                    onChange={onToggle}
                    disabled={mod.mod.option === "required"}
                />
            )}
            {progress && (
                <div
                    className={clsx(
                        "px-2 py-1 w-24 text-center text-sm font-semibold rounded-lg transition duration-500 shrink-0",
                        mapStateStyle(),
                    )}
                >
                    {mapStateLabel()}
                </div>
            )}
        </li>
    )
})
