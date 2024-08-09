"use client"

import InformationCircleIcon from "@/assets/icon/information_circle.svg"
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
            <h3 className="text-neutral-200 grow relative group">
                {mod.mod.name}
                {mod.mod.description && (
                    <>
                        <div className="absolute hidden group-hover:block text-xs font-medium bg-neutral-700/80 z-20 rounded-md px-2 py-1 transition-all">
                            {mod.mod.description}
                        </div>
                        <InformationCircleIcon className="ml-2 w-3 h-3 text-neutral-400 inline" />
                    </>
                )}
            </h3>
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
                        "px-2 py-1 w-24 text-center text-sm font-semibold rounded-lg transition duration-500",
                        mapStateStyle(),
                    )}
                >
                    {mapStateLabel()}
                </div>
            )}
        </li>
    )
})
