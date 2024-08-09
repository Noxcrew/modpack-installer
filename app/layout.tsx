import { Metadata } from "next"
import { PropsWithChildren } from "react"
import "@/styles/global.css"

export const metadata: Metadata = {
    robots: {
        index: false,
    },
}

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
