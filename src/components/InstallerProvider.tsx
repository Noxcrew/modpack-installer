"use client"

import type { PropsWithChildren } from "react"
import { useEffect } from "react"

import type { InstallerContextProps } from "../context"
import { InstallerContext } from "../context"
import { Installer } from "../installer/installer"
import { InstallerUI } from "../installer/ui"
import type { Profile } from "../profile"

export interface Props extends PropsWithChildren {
    initialProfile?: Profile
}

export default function InstallerProvider({ initialProfile, children }: Props) {
    const installer = new Installer(initialProfile)
    const ui = new InstallerUI(installer)

    const context: InstallerContextProps = { installer, ui }

    useEffect(() => {
        ui.checkCompatibility()
    }, [ui])

    return (
        <InstallerContext.Provider value={context}>
            {children}
        </InstallerContext.Provider>
    )
}
