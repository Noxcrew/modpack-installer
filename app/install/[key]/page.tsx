import type { Metadata } from "next"

import InstallerProvider from "@/src/components/InstallerProvider"
import InstallerView from "@/src/components/InstallerView"
import { getProfileByKey } from "@/src/profile.server"
import { InstallPageProps } from "@/src/util/next"
import { notFound } from "next/navigation"

export function generateMetadata(
    props: InstallPageProps,
): Metadata | undefined {
    const profile = getProfileByKey(props.params.key)

    if (!profile) {
        return notFound()
    }

    return {
        title: "One-Click Installer",
        description: `Get ready for ${profile.name} within a few clicks with our online mod installer.`,
    }
}

export default function Install(props: InstallPageProps) {
    const profile = getProfileByKey(props.params.key)

    if (!profile) {
        return notFound()
    }

    return (
        <InstallerProvider initialProfile={profile}>
            <InstallerView />
        </InstallerProvider>
    )
}
