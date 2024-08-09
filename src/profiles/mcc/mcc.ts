import type { Profile } from "../../profile"

export const mccProfile: Profile = {
    active: true,
    key: "6c76b98d1fe1a8d56ddf89dab61c35aff0b4cc4bc914075479f24a87e5604246",
    id: "mcc",
    name: "MC Championship",
    icon: "/assets/logo/logo.png",
    version: {
        loader: "fabric",
        minecraft: "1.21",
    },
    javaArgs: "-Xmx4G -XX:+UseZGC -XX:+ZGenerational",
    servers: [
        {
            name: "MCC Island",
            host: "play.mccisland.net",
        },
    ],
    mods: [
        {
            option: "required",
            name: "Fabric API",
            path: "fabric-api.jar",
            url: "https://cdn.modrinth.com/data/P7dR8mSH/versions/vMQdA5QJ/fabric-api-0.100.7%2B1.21.jar",
        },
        {
            option: "required",
            name: "Sodium",
            path: "sodium.jar",
            url: "https://cdn.modrinth.com/data/AANobbMI/versions/RncWhTxD/sodium-fabric-0.5.11%2Bmc1.21.jar",
            category: "optimization",
        },
        {
            option: "required",
            name: "Lithium",
            path: "lithium.jar",
            url: "https://cdn.modrinth.com/data/gvQqBUqZ/versions/my7uONjU/lithium-fabric-mc1.21-0.12.7.jar",
            category: "optimization",
        },
        {
            option: "required",
            name: "Entity Culling",
            path: "entity-culling.jar",
            url: "https://cdn.modrinth.com/data/NNAgCjsB/versions/Bu3hSiJb/entityculling-fabric-1.6.6-mc1.21.jar",
            category: "optimization",
        },
        {
            option: "required",
            name: "Cloth Config API",
            path: "cloth-config-api.jar",
            url: "https://cdn.modrinth.com/data/9s6osm5g/versions/Yc8omJNb/cloth-config-15.0.127-fabric.jar",
        },
        {
            option: "required",
            name: "Mod Menu",
            path: "mod-menu.jar",
            url: "https://cdn.modrinth.com/data/mOgUt4GM/versions/xhN1IvHi/modmenu-11.0.1.jar",
        },
        {
            option: "required",
            name: "FerriteCore",
            path: "ferrite-core.jar",
            url: "https://cdn.modrinth.com/data/uXXizFIs/versions/wmIZ4wP4/ferritecore-7.0.0-fabric.jar",
            category: "optimization",
        },
        {
            option: "required",
            name: "Logical Zoom",
            path: "logical-zoom.jar",
            url: "https://cdn.modrinth.com/data/8bOImuGU/versions/pfmJF32p/logical_zoom-0.0.25.jar",
            category: "enhancement",
        },
        {
            option: "required",
            name: "Noxesium",
            path: "noxesium.jar",
            url: "https://cdn.modrinth.com/data/Kw7Sm3Xf/versions/LQEZtIPA/noxesium-2.1.4.jar",
            category: "optimization",
            description:
                "Developed by Noxcrew to improve performance and player experience on multiplayer servers",
        },
        {
            option: "optional",
            name: "Flat Lighting (OptiFine Old Lighting)",
            path: "flat-lighting.jar",
            url: "https://cdn.modrinth.com/data/PXsE1tUn/versions/xL4hs6nP/flat-lighting-1.2.0.jar",
            category: "enhancement",
            description:
                "Changes lighting to be similar to Optifine's Old Lighting option",
        },
        {
            option: "optional",
            name: "Toggle Sprint Display",
            path: "togglesprintdisplay.jar",
            url: "https://cdn.modrinth.com/data/shVMaevq/versions/MYOZbZxR/toggle-sprint-display-1.5.0.jar",
            category: "enhancement",
            description:
                "Adds a UI element that shows whether you're sprinting",
        },
    ],
}

