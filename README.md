# CS4135 Project Frontend

Welcome to the frontend of our CS4135 project.

If you are looking for the backend, check [here](https://github.com/evanbuggy/ranked-backend).

Our project is a web app that will be able to calculate and track player's ELO for fighting game tournaments.

# Contributing

(Put VC practices and etiquette here, more info later with more CI/CD tools)

## Windows

The easiest way to develop on Windows is through WSL with Ubuntu. An official Microsoft guide on installation can be found [here](https://learn.microsoft.com/en-us/windows/wsl/install).

## Visual Studio Code and WSL

The WSL extension for VS Code makes development in your Linux environment much easier. An official Microsoft guide on installation can be found [here](https://code.visualstudio.com/docs/remote/wsl).

## Dependencies

### Node Version Manager (NVM)

1. Run `sudo apt-get update` to ensure your package repository is updated.
2. Install curl with `sudo apt install curl`.
3. Run `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash` to install NVM. Verify the installation with `nvm --version`.
4. Install the latest version of Node.js with `nvm install --lts`, or install a specific version instead.
5. You can install and use different Node versions if necessary. List installed versions of Node with `nvm ls` and use a specific version with `nvm use <version>`, for example, `nvm use 25.2.1`.

### Installing packages with Node Package Manager (NPM)

1. Clone the project with `git clone https://github.com/evanbuggy/ranked-frontend.git`.
2. Verify your NPM installation with `npm --version`.
3. Install the project's dependencies with `npm install`. This will automatically install all the packages detailed in the `package.json` file to `/node_modules`. The .gitignore file in this repo should already exclude this folder from commits.
4. Test the app with `npm run dev`.

# Building with Docker

We use Docker to containerize our frontend to aid in building and deployment. This page will be updated over time when necessary but for now will cover basic Docker commands to help you build an image and run a container.

## Installing Docker

Even if you are on Windows using WSL, install Docker Desktop through Windows as it works alongside WSL. Docker Desktop will make the installation process easy and will install the Docker Engine for you. Get it from [here](https://www.docker.com/products/docker-desktop/).

## Docker commands

Docker Compose makes building and running easy. Simply use `docker compose up -d --build` and it should build your image and run the container. You can see the container visible via Docker Desktop.

<img width="1617" height="167" alt="image" src="https://github.com/user-attachments/assets/4fec2345-f0ab-4aff-abe3-b932aaff6737" />

You can use the command `docker compose down` to stop the containers. You can use the command `docker ps -a` to list all currently running containers.