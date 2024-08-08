import { saveAs } from "file-saver"
import JSZip from "jszip"

import type { Profile } from "../profile"

export const archiveProfile = async (profile: Profile) => {
    const zip = new JSZip()
    for (const mod of profile.mods) {
        const res = await fetch(mod.url)

        let path: string
        if (mod.option === "optional") {
            path = `optional/${mod.path}`
        } else {
            path = `${mod.path}`
        }
        zip.file(path, await res.arrayBuffer())
    }
    if (profile.files) {
        for (const [path, url] of Object.entries(profile.files)) {
            const res = await fetch(url)

            zip.file(path, await res.arrayBuffer())
        }
    }
    const blob = await zip.generateAsync({ type: "blob" })
    saveAs(blob, `mods.zip`)
}
