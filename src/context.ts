import { createContext, useContext } from "react"

import type { Installer } from "./installer/installer"
import type { InstallerUI } from "./installer/ui"

export interface InstallerContextProps {
    installer: Installer
    ui: InstallerUI
}

export const InstallerContext = createContext<
    InstallerContextProps | undefined
>(undefined)

/** Provides access to the `InstallerContext`. */
export const useInstaller = (): InstallerContextProps => {
    const context = useContext(InstallerContext)
    if (!context) throw new Error("No installer context found")

    return context
}
