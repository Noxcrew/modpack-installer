import { TwitterLink } from "./TwitterLink"

export default function InstallerFooter() {
    return (
        <footer className="text-center text-neutral-500 pb-2">
            &#169; Noxcrew — originally made with love by{" "}
            <TwitterLink profile="cubxity" /> and{" "}
            <TwitterLink profile="vini2003_dev" />
        </footer>
    )
}
