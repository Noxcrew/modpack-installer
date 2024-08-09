"use client"

import { observer } from "mobx-react-lite"

import { useInstaller } from "../context"
import { InstallerModState } from "../installer/state"
import { ModListItem } from "./mod/ModListItem"

export interface Props {
    progress?: boolean
}

type ModIndex = Record<string, InstallerModState[]>

export default observer(function ModList({ progress }: Props) {
    const { installer } = useInstaller()
    const loader = installer.profile.version.loader

    const modIndex: ModIndex = installer.mods
        .slice()
        .sort((a, b) => {
            if (a.mod.option === "required") {
                return 1
            } else if (b.mod.option === "required") {
                return -1
            }

            return a.mod.category < b.mod.category ? -1 : 1
        })
        .reduce<ModIndex>((index, state) => {
            const category =
                state.mod.option === "required"
                    ? "required"
                    : state.mod.category
            ;(index[category] = index[category] || []).push(state)
            return index
        }, {})

    return (
        <div className="flex flex-col grow">
            <h2 className="text-white font-semibold p-4 border-b border-neutral-800/50">
                Mods
            </h2>
            <div className="grow list-none overflow-y-scroll">
                <div key="loader">
                    <div className="sticky top-0 bg-neutral-800/80 px-4 py-2 text-xs text-white font-semibold uppercase z-10">
                        Minecraft
                    </div>

                    <li className="px-4 py-3 flex flex-row items-center">
                        <h3 className="text-neutral-200 grow relative group">
                            {loader
                                ? loader.charAt(0).toUpperCase() +
                                  loader.slice(1)
                                : "Vanilla"}{" "}
                            {installer.profile.version.minecraft}
                        </h3>
                    </li>
                </div>

                {Object.entries(modIndex).map(([category, mods]) => (
                    <div key={category}>
                        <div className="sticky top-0 bg-neutral-800/80 px-4 py-2 text-xs text-white font-semibold uppercase z-10">
                            {category} ({mods.length})
                        </div>
                        {mods.map((mod) => (
                            <ModListItem
                                mod={mod}
                                onToggle={() => mod.toggle()}
                                progress={progress}
                                key={mod.mod.path}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
})
