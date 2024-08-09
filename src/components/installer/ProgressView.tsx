"use client"

import { useInstaller } from "@/src/context"
import { observer } from "mobx-react-lite"

export const ProgressView = observer(() => {
    const {
        installer: { progress },
    } = useInstaller()

    return (
        <>
            {progress.display && (
                <h4 className="text-neutral-300 font-semibold mb-2">
                    {progress.display}
                </h4>
            )}
            {progress.progress !== undefined && (
                <div className="w-full bg-green-500/20 rounded-full h-2.5">
                    <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${progress.progress * 100}%` }}
                    />
                </div>
            )}
        </>
    )
})
