import type { Installer } from "../installer"
import { writeManifest } from "./manifest"

/** Creates a Vanilla profile as described in the `installer`. */
export const installVanilla = async (installer: Installer): Promise<void> => {
    const id = `nox-${installer.profile.id}`

    const manifest = {
        id: id,
        inheritsFrom: installer.profile.version.minecraft,
        type: "release",
        arguments: {
            game: ["--gameDir", id],
            jvm: [],
        },
    }
    await writeManifest(installer, manifest)
}
