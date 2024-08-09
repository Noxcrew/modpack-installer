import { Installer } from "../installer"

/** A launcher manifest file, found in `<minecraft>/versions/<version>/<version>.json`. */
interface LauncherManifest {
    id: string
    inheritsFrom: string
    type: string
    arguments: {
        game: string[]
        jvm: string[]
    }
    libraries?: {
        name: string
        url: string
    }[]
}

/** Writes the manifest provided to the relevant launcher version directory. */
export const writeManifest = async (
    installer: Installer,
    manifest: LauncherManifest,
): Promise<void> => {
    const versionsHandle = await installer.handle.getDirectoryHandle(
        "versions",
        {
            create: true,
        },
    )

    const id = `nox-${installer.profile.id}`
    const loaderVersionHandle = await versionsHandle.getDirectoryHandle(id, {
        create: true,
    })
    const loaderVersionManifestHandle = await loaderVersionHandle.getFileHandle(
        `${id}.json`,
        { create: true },
    )

    const writable = await loaderVersionManifestHandle.createWritable({
        keepExistingData: false,
    })
    try {
        await writable.write(JSON.stringify(manifest))
    } finally {
        await writable.close()
    }
}
