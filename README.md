<p align="center">
    <h1 align="center">Modpack Installer</h1>
</p>

<p align="center">Download and install Minecraft profiles in one click.</p>

<p align="center">Originally made by <a href="https://twitter.com/cubxity">@cubxity</a> and <a href="https://twitter.com/vini2003_dev">@vini2003_dev</a>.</p>

## Usage

You can try it out for yourself using our [publicly-available profile](https://modpack-installer.vercel.app/install/6c76b98d1fe1a8d56ddf89dab61c35aff0b4cc4bc914075479f24a87e5604246).

We welcome others deploying instances to host their mod profiles.

1. Fork this repository and download dependencies.
2. Create your profile in `src/profiles`. An example file is provided, and type-checking is available using the `Profile` interface.
3. Include your profiles in the `PROFILES` list at `src/profiles.server.ts`. **Only profiles in this list are accessible.**
4. Use a local server (`yarn dev`) to test. Your profile will be available to install at `http://localhost:3000/install/<key>`.
5. Deploy using your favourite hosting provider.

## Contributions

We welcome the reporting of Issues and the creation of Pull Requests.
