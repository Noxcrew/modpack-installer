import type { Installer } from "../installer";

import { writeManifest } from "./vanilla";

const MAVEN_URL = "https://maven.fabricmc.net/";
const API_ENDPOINT = "https://meta.fabricmc.net/v2";

export const installFabric = async (installer: Installer): Promise<void> => {
  let version = installer.profile.version.loaderVersion;
  if (!version) {
    const descriptor = await installer
      .fetchWithRetry(`${API_ENDPOINT}/versions/loader`)
      .then((res) => res.json())
      .then((json) => json[0]);

    version = descriptor["version"] as string;
  }

  const meta = await installer
    .fetchWithRetry(
      `${MAVEN_URL}/net/fabricmc/fabric-loader/${version}/fabric-loader-${version}.json`
    )
    .then((res) => res.json());

  const id = `innit-${installer.profile.id}`;

  const manifest = {
    id: id,
    inheritsFrom: installer.profile.version.minecraft,
    type: "release",
    mainClass: meta["mainClass"]["client"],
    arguments: {
      game: ["--gameDir", id],
      jvm: ["-DFabricMcEmu= net.minecraft.client.main.Main"],
    },
    libraries: [
      ...meta["libraries"]["common"],
      ...meta["libraries"]["client"],
      {
        name: `net.fabricmc:intermediary:${installer.profile.version.minecraft}`,
        url: "https://maven.fabricmc.net/",
      },
      {
        name: `net.fabricmc:fabric-loader:${version}`,
        url: "https://maven.fabricmc.net/",
      },
    ],
  };
  await writeManifest(installer, manifest);
};
