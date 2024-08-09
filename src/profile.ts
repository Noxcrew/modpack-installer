/** Whether the profile component is required, recommended, or optional. */
export type ComponentInstallOption = "required" | "recommended" | "optional"

/** The profile version loader - only Fabric is supported. */
export type ProfileVersionLoader = "fabric"

/** The profile to install. */
export interface Profile {
    readonly active?: boolean
    readonly key: string
    readonly id: string
    readonly name: string
    readonly icon: string
    readonly version: ProfileVersion
    readonly javaArgs?: string
    readonly servers: ProfileServer[]
    readonly mods: ProfileMod[]
    readonly files?: Record<string, string>
}

/** The version of Minecraft and the mod loader to use. */
export interface ProfileVersion {
    readonly loader?: ProfileVersionLoader
    readonly loaderVersion?: string
    readonly minecraft: string
}

/** A server to include in the profile. */
export interface ProfileServer {
    readonly name: string
    readonly host: string
}

/** The type of mod to display to the user. */
export type ProfileModCategory = "optimization" | "enhancement" | "other"

/** The mod to install. */
export interface ProfileMod {
    readonly option: ComponentInstallOption
    readonly name: string
    readonly description?: string
    readonly path: string
    readonly url: string
    readonly category?: ProfileModCategory
}
