import { PropsWithChildren, ReactNode } from "react"
import { AlertView } from "./AlertView"
import { ProgressView } from "./ProgressView"

interface Props extends PropsWithChildren {
    title: string
    description: ReactNode
    showProgress?: boolean
}

export const CardLayout = (props: Props) => {
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
