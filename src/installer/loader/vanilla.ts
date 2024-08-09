import type { Installer } from "../installer"

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

export const writeManifest = async (
    installer: Installer,
    manifest: any,
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
