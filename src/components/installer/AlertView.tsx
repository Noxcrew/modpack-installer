"use client"

import { useInstaller } from "@/src/context"
import { observer } from "mobx-react-lite"

export const AlertView = observer(() => {
    const { ui } = useInstaller()

    return (
        <>
            {ui.alert && (
                <div className="bg-red-500/20 rounded-lg p-4 my-4">
                    <p className="text-red-500 font-semibold">{ui.alert}</p>
                </div>
            )}
        </>
    )
})
