import { Buffer } from "buffer"
import nbt from "prismarine-nbt"

import type { Profile } from "../profile"
import { attempt } from "../util/promise"

/** Creates the `servers.dat` NBT file. */
export const createServersNBT = async (
    profile: Profile,
    serversDat: Buffer,
): Promise<Buffer> => {
    const userAddedServers = await getUserServers(profile, serversDat)

    const servers = nbt.comp({
        servers: nbt.list(
            nbt.comp([
                // First add the servers in the profile at the top of the list
                ...profile.servers.map((server) => {
                    return {
                        name: nbt.string(server.name),
                        ip: nbt.string(server.host),
                        hidden: nbt.byte(0),
                    }
                }),
                // Then add any servers which the user has added previously (if the profile already exists locally)
                ...(userAddedServers ?? []),
            ]),
        ),
    })

    //@ts-ignore unknowable type error
    return nbt.writeUncompressed(servers)
}

/** Returns the servers the user has added which are not part of the `profile`. */
export const getUserServers = async (profile: Profile, serversDat: Buffer) => {
    // If the servers.dat file is empty we have nothing to do
    if (serversDat.length === 0) return

    const hosts = profile.servers.map((server) => server.host)

    const [current, err] = await attempt(nbt.parse(serversDat))

    if (err) return

    //@ts-ignore ignore type checking for large nbt structures
    return current?.parsed.value.servers.value.value
        .filter((server) => !hosts.includes(server.ip.value))
        .map((server) => {
            return {
                name: nbt.string(server.name.value),
                ip: nbt.string(server.ip.value),
                hidden: nbt.byte(server.hidden.value),
            }
        })
}
