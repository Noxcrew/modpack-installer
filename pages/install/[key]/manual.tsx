import type { GetStaticPaths, GetStaticProps } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"

import ContentCopyIcon from "@/assets/icon/content_copy.svg"
import FileDownloadIcon from "@/assets/icon/file_download.svg"
import CardButton from "@/src/components/CardButton"
import SEO from "@/src/components/SEO"
import type { Profile, ProfileServer } from "@/src/profile"
import { getProfileByKey, getStaticProfilePaths } from "@/src/profile.server"
import { archiveProfile } from "@/src/util/archiver"
import { getSystemMinecraftPath } from "@/src/util/platform"

interface ManualPageProps {
    profile: Profile
}

const FabricInstructions = ({ profile }: ManualPageProps) => {
    return (
        <>
            <li>
                Download the Fabric installer from&nbsp;
                <a
                    className="text-blue-400"
                    rel="noreferrer"
                    target="_blank"
                    href="https://fabricmc.net/use/installer/"
                >
                    here
                </a>
            </li>
            <li>
                Run the installer and install Fabric for{" "}
                <b>Minecraft {profile.version.minecraft}</b>
            </li>
        </>
    )
}

const ModsInstructions = () => {
    // Assume Windows by default, since most users use Windows (sadly)
    const [path, setPath] = useState<string | undefined>()

    useEffect(() => {
        if (!navigator.platform.toLowerCase().includes("win")) {
            setPath(getSystemMinecraftPath())
        }
    }, [])

    return (
        <>
            <li>
                {path ? (
                    <>
                        Navigate to <b>{path}</b>
                    </>
                ) : (
                    <>
                        Press Win + R, type <b>%appdata%\.minecraft</b>
                    </>
                )}
                , and create an empty folder called <b>mods</b>{" "}
                <b className="text-yellow-200 ml-2">
                    ⚠️ If there is an existing one, clear it!
                </b>
            </li>
            <li>
                Download the mods and extract the contents of <b>mods.zip</b>{" "}
                into the mods folder
            </li>
        </>
    )
}

const InstallerAlert = ({ profile }: ManualPageProps) => {
    return (
        <div className="invisible lg:visible absolute right-8 bottom-8 p-6 bg-neutral-800 rounded-lg shadow-lg max-w-[26rem]">
            <h3 className="text-white text-xl font-bold mb-2">Notice</h3>
            <p className="text-neutral-300">
                Your browser may support our automatic web-based installer.
                Getting ready is just a few clicks away.
            </p>
            <div>
                <Link
                    type="button"
                    href={`../${profile.key}`}
                    className="bg-green-500 text-sm font-semibold px-3 py-1 w-fit rounded-md mt-4"
                    passHref
                >
                    Try it
                </Link>
            </div>
        </div>
    )
}

export default function ManualPage({ profile }: ManualPageProps) {
    const [isInstallerSupported, setInstallerSupported] = useState(false)

    useEffect(() => {
        setInstallerSupported("FileSystemHandle" in window)
    }, [])

    const handleCopyServer = async (server: ProfileServer) => {
        await navigator.clipboard.writeText(server.host)
    }

    return (
        <>
            <SEO
                title="Installation Guide"
                description="Get ready for your next event with our simple installation guide."
            />
            <div className="px-8 py-12 lg:px-24 lg:py-16">
                <h1 className="text-6xl text-white font-bold">
                    {profile.name}
                </h1>
                <h2 className="text-2xl text-neutral-400 font-semibold mt-4">
                    Manual installation
                </h2>
                <ul className="text-xl text-neutral-200 list-decimal list-inside mt-8 space-y-2">
                    <li>Close the Minecraft Launcher</li>
                    {profile.version.loader === "fabric" && (
                        <FabricInstructions profile={profile} />
                    )}
                    {profile.mods.length !== 0 && <ModsInstructions />}
                    <li>
                        Open the Minecraft Launcher and launch the installed
                        profile called <b>(innit.gg) {profile.name}</b>
                    </li>
                    {profile.servers.length !== 0 && (
                        <li>
                            Add the server address(es) below to your server list
                        </li>
                    )}
                </ul>
                <h1 className="mt-4">
                    <b className="text-xl text-white">Mods</b>
                    <h2 className="text-sm text-neutral-400 italic">
                        Click button to download!
                    </h2>
                </h1>
                <div className="flex flex-col lg:flex-row mt-2 space-y-4 lg:space-y-0 lg:space-x-4">
                    <CardButton
                        icon={<FileDownloadIcon width={24} />}
                        onClick={() => archiveProfile(profile)}
                    >
                        mods.zip
                    </CardButton>
                </div>
                <h1 className="mt-4">
                    <b className="text-xl text-white">Servers</b>
                    <h2 className="text-sm text-neutral-400 italic">
                        Click button to copy!
                    </h2>
                </h1>
                <div className="flex flex-col lg:flex-row mt-2 space-y-4 lg:space-y-0 lg:space-x-4">
                    {profile.servers.map((server) => (
                        <CardButton
                            icon={<ContentCopyIcon width={24} />}
                            key={server.host}
                            onClick={() => handleCopyServer(server)}
                        >
                            {server.host}
                        </CardButton>
                    ))}
                </div>
            </div>
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
