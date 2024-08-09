"use client"

import { getSystemMinecraftPath } from "@/src/util/platform"
import { useEffect, useState } from "react"

export const ModsInstructions = () => {
    // Assume Windows by default, since most users use Windows
    const [path, setPath] = useState<string | undefined>()

    useEffect(() => {
        if (!navigator.platform.toLowerCase().includes("win")) {
            setPath(getSystemMinecraftPath())
        }
    }, [])

    return (
        <>
            <li>
                {path ? (
                    <>
                        Navigate to <b>{path}</b>
                    </>
                ) : (
                    <>
                        Press Win + R, type <b>%appdata%\.minecraft</b>
                    </>
                )}
                , and create an empty folder called <b>mods</b>{" "}
                <b className="text-yellow-200 ml-2">
                    ⚠️ If there is an existing one, clear it!
                </b>
            </li>
            <li>
                Download the mods and extract the contents of <b>mods.zip</b>{" "}
                into the mods folder
            </li>
        </>
    )
}
