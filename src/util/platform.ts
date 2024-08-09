/** Returns the system Minecraft path. */
export const getSystemMinecraftPath = (): string => {
    const platform = navigator.platform.toLowerCase()

    if (platform.includes("win")) {
        return "%appdata%\\.minecraft"
    } else if (platform.includes("mac")) {
        return "~/Library/Application Support/minecraft"
    }

    return "~/.minecraft"
}
