/** Locally-stored information about the installed profile, stored in `<profile>/modpack-installer.json`. */
export interface Config {
    /** The hash of the profile object. */
    version: string
    /** Optional mods in the profile and whether the user toggled them. */
    optionalMods: OptionalMod[]
}

/** A mod which can be optionally installed from a profile. */
export interface OptionalMod {
    path: string
    enabled: boolean
}
