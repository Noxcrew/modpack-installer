import type { ReactNode } from "react"
import { useState } from "react"

export interface CardButtonProps {
    children: ReactNode
    icon?: ReactNode
    onClick?: () => void | Promise<void>
}

export default function CardButton(props: CardButtonProps) {
    const { children, icon, onClick } = props

    const [loading, setLoading] = useState(false)

    const handleClick = async () => {
        if (onClick) {
            try {
                setLoading(true)
                await onClick()
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <button
            type="button"
            className="flex flex-row items-center bg-neutral-800 px-4 py-2 font-semibold text-green-500 rounded-lg border-2 border-transparent hover:border-green-500 transition-colors"
            onClick={handleClick}
            disabled={loading}
        >
            {loading && (
                <svg
                    className="animate-spin h-5 w-5 ml-1 mr-3 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}
            {!loading && icon && <div className="mr-3">{icon}</div>}
            {children}
        </button>
    )
}
