import { observer } from "mobx-react-lite"
import Link from "next/link"
import type { ReactNode } from "react"
import { useEffect, useState } from "react"

import { useInstaller } from "../context"
import { getSystemMinecraftPath } from "../util/platform"

import ActionButton from "./ActionButton"

interface CardLayoutProps {
    title: string
    description: ReactNode
    showProgress?: boolean
    children?: ReactNode
}

const AlertView = observer(() => {
    const { ui } = useInstaller()

    return (
        <>
            {ui.alert && (
                <div className="bg-red-500/20 rounded-lg p-4 my-4">
                    <p className="text-red-500 font-semibold">{ui.alert}</p>
                </div>
            )}
        </>
    )
})

const ProgressView = observer(() => {
    const {
        installer: { progress },
    } = useInstaller()

    return (
        <>
            {progress.display && (
                <h4 className="text-neutral-300 font-semibold mb-2">
                    {progress.display}
                </h4>
            )}
            {progress.progress !== undefined && (
                <div className="w-full bg-green-500/20 rounded-full h-2.5">
                    <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{ width: `${progress.progress * 100}%` }}
                    />
                </div>
            )}
        </>
    )
})

const CardLayout = (props: CardLayoutProps) => {
    const { title, description, showProgress, children } = props

    return (
        <>
            <h1 className="text-3xl text-white font-bold">{title}</h1>
            <p className="text-lg text-neutral-400 mt-4">{description}</p>
            <div className="grow" />
            <AlertView />
            {showProgress && <ProgressView />}
            {children}
        </>
    )
}

export default observer(function InstallerPanel() {
    const { installer, ui } = useInstaller()
    const [path, setPath] = useState<string | undefined>()

    useEffect(() => {
        setPath(getSystemMinecraftPath)
    }, [])

    return (
        <div className="flex flex-col p-8 pb-6 min-w-[42%] max-w-[42%] border-r border-neutral-800">
            {ui.stage === "onboarding" && (
                <CardLayout
                    title={
                        ui.isCompatible === false
                            ? "Unsupported Browser"
                            : "Let's get ready!"
                    }
                    description={
                        ui.isCompatible === false ? (
                            "Please use a Chromium-based browser, such as Google Chrome or Microsoft Edge."
                        ) : (
                            <>
                                It&apos;s time to prepare you for&nbsp;
                                <b>{installer.profile.name}</b>! This will
                                automatically create a separate profile in the
                                Minecraft Launcher for you.
                                <br />
                                <br />
                                <span className="text-red-400">
                                    Use the <b>Manual Install</b> option if you
                                    experience issues.
                                </span>
                            </>
                        )
                    }
                >
                    <ActionButton
                        onClick={ui.isCompatible && (() => ui.proceed())}
                        href={
                            ui.isCompatible === false &&
                            `${installer.profile.key}/manual`
                        }
                        disabled={ui.isCompatible === undefined}
                    >
                        {ui.isCompatible === undefined
                            ? "Checking compatibility..."
                            : ui.isCompatible
                              ? "Let's begin"
                              : "Manual Install"}
                    </ActionButton>
                    {ui.isCompatible && (
                        <Link
                            href={`${installer.profile.key}/manual`}
                            className="text-sm text-neutral-500 text-center mt-2"
                            passHref
                        >
                            Manual install
                        </Link>
                    )}
                </CardLayout>
            )}
            {ui.stage === "fileaccess" && (
                <CardLayout
                    title="Let's find Minecraft!"
                    description={
                        <>
                            Please drag &apos;n drop the{" "}
                            <b>{path || "Loading..."}</b> folder to this window.
                            Ensure Minecraft is closed.
                        </>
                    }
                />
            )}
            {ui.stage === "install" && (
                <CardLayout
                    title="Almost there!"
                    description="This shouldn't take too long."
                    showProgress={installer.state !== "failed"}
                >
                    {installer.state === "failed" && (
                        <ActionButton onClick={() => ui.handleDump()}>
                            Download logs
                        </ActionButton>
                    )}
                </CardLayout>
            )}
            {ui.stage === "complete" && (
                <CardLayout
                    title="Installation complete!"
                    description={
                        <>
                            Congratulations! You may now launch{" "}
                            <b>{installer.profile.name}</b> from your Minecraft
                            launcher.
                        </>
                    }
                />
            )}
        </div>
    )
})
