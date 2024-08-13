"use client"

import { useInstaller } from "@/src/context"
import Link from "next/link"
import { ReactNode } from "react"
import ActionButton from "../ActionButton"
import { CardLayout } from "./CardLayout"

interface Props {
    title: string
    description: ReactNode | string
}

export const OnboardingInstallerPanel = (props: Props) => {
    const { installer, ui } = useInstaller()

    return (
        <CardLayout
            title={
                ui.isCompatible === false ? "Unsupported Browser" : props.title
            }
            description={
                ui.isCompatible === false
                    ? "Please use a Chromium-based browser, such as Google Chrome or Microsoft Edge."
                    : props.description
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
    )
}
