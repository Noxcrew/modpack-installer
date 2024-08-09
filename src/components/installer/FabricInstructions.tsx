import type { ManualInstallerProps } from "../ManualInstaller"

export const FabricInstructions = ({ profile }: ManualInstallerProps) => {
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
