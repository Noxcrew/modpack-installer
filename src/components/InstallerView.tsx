import clsx from "clsx"
import { observer } from "mobx-react-lite"
import type { DragEvent } from "react"
import { useEffect, useState } from "react"

import DoneIllustration from "../../assets/illustration/done.svg"
import QuestionsIllustration from "../../assets/illustration/questions.svg"
import { useInstaller } from "../context"

import InstallerFooter from "./InstallerFooter"
import InstallerPanel from "./InstallerPanel"
import ModList from "./ModList"

export default observer(function InstallerView() {
    const { ui } = useInstaller()

    const [isDragging, setDragging] = useState(false)

    useEffect(() => {
        window.addEventListener("keydown", (event) => {
            if (event.ctrlKey && event.key === "D") {
                event.preventDefault()
                ui.handleDump()
            }
        })
    }, [])

    const handleDrop = async (e: DragEvent) => {
        e.preventDefault()
        setDragging(false)

        if (!ui.isComplete) {
            for (const item of e.dataTransfer.items) {
                if (item.kind === "file") {
                    await ui.handleDrop(await item.getAsFileSystemHandle())
                    return
                }
            }

            ui.setAlert("That didn't work. Try again?")
        }
    }

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
        if (!ui.isComplete) {
            setDragging(true)
        }
    }

    const handleDragLeave = () => {
        setDragging(false)
    }

    return (
        <div
            className="h-screen flex flex-col items-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
        >
            <div className="grow" />
            <div
                className={clsx(
                    "w-full h-full min-h-[22rem] max-w-[54rem] max-h-[32rem] border-2 border-neutral-800 rounded-xl flex-row transition-colors duration-300 hidden md:flex my-4",
                    isDragging && "border-green-500",
                )}
            >
                <InstallerPanel />
                {ui.isCompatible === false && (
                    <div className="p-20 m-auto">
                        <QuestionsIllustration />
                    </div>
                )}
                {ui.isCompatible !== false &&
                    (ui.stage === "onboarding" || ui.stage === "install") && (
                        <ModList progress={ui.stage === "install"} />
                    )}
                {ui.stage === "fileaccess" && (
                    <div className="relative grow">
                        <video
                            className="absolute top-0 left-0 right-0 bottom-0 m-auto"
                            src="/assets/video/install-drop-folder.webm"
                            autoPlay={true}
                            loop={true}
                            controls={false}
                        />
                    </div>
                )}
                {ui.stage === "complete" && (
                    <div className="grow p-20 m-auto">
                        <DoneIllustration />
                    </div>
                )}
            </div>
            <div className="block md:hidden px-4">
                <h1 className="text-2xl text-white font-semibold mb-2 text-center">
                    Screen unsupported
                </h1>
                <p className="text-neutral-300 text-center">
                    Your browser is too small to run this application, please
                    enlarge it.
                </p>
            </div>
            <div className="grow" />
            <InstallerFooter />
        </div>
    )
})
