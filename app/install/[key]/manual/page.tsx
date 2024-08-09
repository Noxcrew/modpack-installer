import { ManualInstaller } from "@/src/components/ManualInstaller"
import { getProfileByKey } from "@/src/profile.server"
import { InstallPageProps } from "@/src/util/next"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export function generateMetadata(
    props: InstallPageProps,
): Metadata | undefined {
    const profile = getProfileByKey(props.params.key)

    if (!profile) {
        return notFound()
    }

    return {
        title: "Manual Installer",
        description: `Get ready for ${profile.name} within a few clicks with out online mod installer.`,
    }
}

export default function ManualPage(props: InstallPageProps) {
    const profile = getProfileByKey(props.params.key)

    if (!profile) {
        return notFound()
    }

    return <ManualInstaller profile={profile} />
}
