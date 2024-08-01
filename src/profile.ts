export type ComponentInstallOption = "required" | "recommended" | "optional";

// Don't think about implementing Forge...
export type ProfileVersionLoader = "fabric";

export interface Profile {
  readonly active?: boolean;
  readonly key: string;
  readonly id: string;
  readonly name: string;
  readonly version: ProfileVersion;
  readonly servers: ProfileServer[];
  readonly mods: ProfileMod[];
  readonly files?: Record<string, string>;
}

export interface ProfileVersion {
  readonly loader?: ProfileVersionLoader;
  readonly loaderVersion?: string; // TODO: Is there a better way to structure this?
  readonly minecraft: string;
}

export interface ProfileServer {
  readonly name: string;
  readonly host: string;
}

export type ProfileModCategory = "optimization" | "enhancement" | "other";

export interface ProfileMod {
  readonly option: ComponentInstallOption;
  readonly name: string;
  readonly description?: string;
  readonly path: string;
  readonly url: string;
  readonly category?: ProfileModCategory;
}
