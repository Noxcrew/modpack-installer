import { FabricManifest, FabricVersions } from "@/src/util/fabric"
import type { Installer } from "../installer"
import { writeManifest } from "./manifest"

/** The URL of Fabric's Maven repository. */
const MAVEN_URL = "https://maven.fabricmc.net"

/** The URL of Fabric's API. */
const API_ENDPOINT = "https://meta.fabricmc.net/v2"

/** Creates a Fabric profile as described on the `installer`. */
export const installFabric = async (installer: Installer): Promise<void> => {
    // Get the mod loader version desired in the profile
    // If the loader version does not exist, fetch the most recent version identifier
    const version =
        installer.profile.version.loaderVersion ??
        (await getLatestFabricVersion(installer))

    // Get the jar manifest to indicate libraries to include in the launcher manifest
    const metaRes = await installer.fetchWithRetry(
        `${MAVEN_URL}/net/fabricmc/fabric-loader/${version}/fabric-loader-${version}.json`,
    )
    const meta = (await metaRes.json()) as FabricManifest

    const id = `nox-${installer.profile.id}`

    const manifest = {
        id: id,
        inheritsFrom: installer.profile.version.minecraft,
        type: "release",
        mainClass: meta.mainClass.client,
        arguments: {
            game: ["--gameDir", id],
            jvm: ["-DFabricMcEmu= net.minecraft.client.main.Main"],
        },
        libraries: [
            ...meta.libraries.common,
            ...meta.libraries.client,
            {
                name: `net.fabricmc:intermediary:${installer.profile.version.minecraft}`,
                url: "https://maven.fabricmc.net/",
            },
            {
                name: `net.fabricmc:fabric-loader:${version}`,
                url: "https://maven.fabricmc.net/",
            },
        ],
    }
    await writeManifest(installer, manifest)
}

/** Returns the latest version of Fabric. */
const getLatestFabricVersion = async (installer: Installer) => {
    const res = await installer.fetchWithRetry(
        `${API_ENDPOINT}/versions/loader`,
    )
    const json = (await res.json()) as FabricVersions
    return json[0].version
}
