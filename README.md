<p align="center">
    <h1 align="center">Modpack Loader</h1>
</p>

<p align="center">Download and install Minecraft profiles in one click.</p>

## Usage

We welcome others deploying instances to host their own mod profiles.

1. Fork this repository and download dependencies.
2. Create your profile in `src/profiles`. An example file is provided, and type-checking is available using the `Profile` interface.
3. Include your profiles in the `PROFILES` list located at `src/profiles.server.ts`. **Only profiles in this list are accessible.**
4. Use a local server (`yarn dev`) to test. Your profile will be available to install at `http://localhost:3000/install/<key>`.
5. Deploy using your favourite hosting provider.

## Contributions

We welcome the reporting of Issues and the creation of Pull Requests.
