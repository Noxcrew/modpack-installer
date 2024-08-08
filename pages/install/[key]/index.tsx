import type { GetStaticPaths, GetStaticProps } from "next"

import InstallerProvider from "../../../src/components/InstallerProvider"
import InstallerView from "../../../src/components/InstallerView"
import SEO from "../../../src/components/SEO"
import type { Profile } from "../../../src/profile"
import {
    getProfileByKey,
    getStaticProfilePaths,
} from "../../../src/profile.server"

export interface InstallPageProps {
    profile: Profile
}

export default function InstallPage({
    profile: initialProfile,
}: InstallPageProps) {
    return (
        <>
            <SEO
                title="Online Installer"
                description={`Get ready for ${initialProfile.name} within a few clicks with our online mod installer.`}
            />
            <InstallerProvider initialProfile={initialProfile}>
                <InstallerView />
            </InstallerProvider>
        </>
    )
}

export const getStaticProps: GetStaticProps = (context) => {
    const key = context.params["key"] as string
    const profile = getProfileByKey(key)

    if (!profile) {
        return { notFound: true }
    }

    return {
        props: { profile },
    }
}

export const getStaticPaths: GetStaticPaths = () => {
    return {
        paths: getStaticProfilePaths(),
        fallback: false,
    }
}
