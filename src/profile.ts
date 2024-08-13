/** Whether the profile component is required, recommended, or optional. */
export type ComponentInstallOption = "required" | "recommended" | "optional"

/** The profile version loader - only Fabric is supported. */
export type ProfileVersionLoader = "fabric"

/** The profile to install. */
export interface Profile {
    /** Whether the profile is active (visible). */
    readonly active?: boolean
    /** The profile's key, used to determine the URL of the installer. */
    readonly key: string
    /** The profile's ID, used to uniquely identify it among other profiles in the launcher. */
    readonly id: string
    /** The profile's name, used to identify it in the launcher. */
    readonly name: string
    /** A URL to a PNG icon for the profile. */
    readonly icon: string
    /** Minecraft and mod loader version information. */
    readonly version: ProfileVersion
    /** Java Arguments to include in the profile (defaults are included if unspecified). */
    readonly javaArgs?: string
    /** Servers to include in the profile's `servers.dat` file. */
    readonly servers: ProfileServer[]
    /** Mods to include in the profile. */
    readonly mods: ProfileMod[]
    /** Arbitrary files to include in the profile. */
    readonly files?: Record<string, string>
    /** Forces the user to manually install the profile. */
    readonly forceManualInstallation?: boolean
}

/** The version of Minecraft and the mod loader to use. */
export interface ProfileVersion {
    /** The loader to use in the profile. */
    readonly loader?: ProfileVersionLoader
    /** The version of the mod loader to use. If unspecified, we use the latest version. */
    readonly loaderVersion?: string
    /** The Minecraft version to use in the profile. */
    readonly minecraft: string
}

/** A server to include in the profile. */
export interface ProfileServer {
    /** The name of the server. */
    readonly name: string
    /** The host of the server. */
    readonly host: string
}

/** The type of mod to display to the user. */
export type ProfileModCategory = "optimization" | "enhancement" | "other"

/** The mod to install. */
export interface ProfileMod {
    /** Whether the mod is required, recommended, or optional. */
    readonly option: ComponentInstallOption
    /** The name of the mod to show in the UI. */
    readonly name: string
    /** A description of the mod to show in a tooltip, if included.. */
    readonly description?: string
    /** Where to store the mod in the profile. Used as a pseudo-key to identify the mod. */
    readonly path: string
    /** A URL indicating where to download the mod from. */
    readonly url: string
    /** The mod's category. */
    readonly category?: ProfileModCategory
}
