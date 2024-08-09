import type { Profile } from "./profile"
import { mccPrivateProfile, mccProfile } from "./profiles/mcc/mcc"

/** The profiles made available by the mod loader. */
export const PROFILES: Profile[] = [mccProfile, mccPrivateProfile]

/** Returns a profile based on its associated `key` attribute, or undefined if none exist with that `key`. */
export const getProfileByKey = (key: string): Profile | undefined =>
    PROFILES.find((profile) => profile.active && profile.key === key)
