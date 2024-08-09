"use client"

import ContentCopyIcon from "@/assets/icon/content_copy.svg"
import FileDownloadIcon from "@/assets/icon/file_download.svg"
import { useEffect, useState } from "react"
import { Profile, ProfileServer } from "../profile"
import { archiveProfile } from "../util/archiver"
import { getSystemMinecraftPath } from "../util/platform"
import CardButton from "./CardButton"

interface ManualPageProps {
    profile: Profile
}

export function ManualInstaller({ profile }: ManualPageProps) {
    const handleCopyServer = async (server: ProfileServer) => {
        await navigator.clipboard.writeText(server.host)
    }

    return (
        <div className="px-8 py-12 lg:px-24 lg:py-16">
            <h1 className="text-6xl text-white font-bold">{profile.name}</h1>
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
                    Open the Minecraft Launcher and launch the installed profile
                    called <b>(innit.gg) {profile.name}</b>
                </li>
                {profile.servers.length !== 0 && (
                    <li>
                        Add the server address(es) below to your server list
                    </li>
                )}
            </ul>
            <h1 className="mt-4">
                <b className="text-xl text-white">Mods</b>
                <p className="text-sm text-neutral-400 italic">
                    Click button to download!
                </p>
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
                <p className="text-sm text-neutral-400 italic">
                    Click button to copy!
                </p>
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
    )
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
