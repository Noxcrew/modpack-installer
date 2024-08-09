/** The Fabric version manifest. */
export type FabricVersions = {
    separator: string
    build: number
    maven: string
    version: string
    stable: boolean
}[]

/** An item in the Fabric Maven manifest. */
export interface FabricManifest {
    version: number
    min_java_version: number
    libraries: {
        client: Library[]
        common: Library[]
        server: Library[]
        development: Library[]
    }
    mainClass: {
        client: string
        server: string
    }
}

/** A library related to the Maven manifest. */
interface Library {
    name: string
    url: string
    md5: string
    sha1: string
    sha256: string
    sha512: string
    size: number
}
