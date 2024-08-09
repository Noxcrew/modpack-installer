import Link from "next/link"
import type { ReactNode } from "react"

export interface ActionButtonProps {
    children: ReactNode
    onClick?: () => void
    href?: string
    disabled?: boolean
}

export default function ActionButton(props: ActionButtonProps) {
    const { children, onClick, href, disabled } = props

    const button = (
        <button
            type="button"
            className="bg-green-500/20 py-2 font-semibold text-green-500 rounded-lg border-2 border-transparent hover:border-green-500 transition-colors w-full"
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )

    if (href) {
        return (
            <Link href={href} passHref>
                {button}
            </Link>
        )
    }

    return button
}
