import { useRouter } from "next/router"
import { useEffect } from "react"

export default function NotFound() {
    const router = useRouter()

    useEffect(() => {
        router.push("https://noxcrew.com")
    }, [router])

    return null
}
