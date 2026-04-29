# Pf2e Combat Tracker

A web application for tracking initiative order and conditions during combat for tabletop rpgs.

## Technology Stack

- [SvelteKit](https://svelte.dev/docs/kit/introduction): A javascript/typescript framework for applications using Svelte.
- [Svelte](https://svelte.dev/docs/svelte/overview): A javascript/typescript framework for building reactive component based web interfaces.
- [Drizzle](https://orm.drizzle.team/docs/overview): A typescript ORM for managing database interaction.
- [SQLite](https://sqlite.org/docs.html): An embedded relational SQL database.
- [Docker](https://docs.docker.com/): Containerization for running and deploying the project.

## Developing

This project uses a [VSCode Dev Container](https://code.visualstudio.com/docs/devcontainers/containers) to prepackage project dependencies and tooling.

### Dependencies

1. [VSCode](https://code.visualstudio.com/)
2. [Docker](https://www.docker.com/)
3. [VSCode Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Instructions

1. Git checkout the project
    ```bash
    # SSH
    git clone ssh://git@gitea.internal.alaeron.com/Alaeron/pf2e_combat_tracker.git
    # Or HTTPS
    git clone https://gitea.internal.alaeron.com/Alaeron/pf2e_combat_tracker.git
    ```
2. Open it in VSCode
3. In the bottom left, click the "><" icon and "Reopen in container"
4. VSCode will now build the container and install development dependencies
5. Install dependencies (using a dev container terminal)
    ```bash
    npm install
    ```

### Running

1. Run
    ```bash
    docker compose up -d
    ```
2. Go to http://localhost:5173
