# CS4135 Project Frontend ([ranked-frontend](https://github.com/evanbuggy/ranked-frontend))

Welcome to the frontend of our CS4135 project.

If you are looking for the backend, check [ranked-backend](https://github.com/evanbuggy/ranked-backend) (update the link if your team uses a different URL).

Our project is a web app that calculates and tracks player Elo for fighting game tournaments. This repo includes the **full tournament UI** (Vite + React + MUI) wired to the Spring API.

## Quick start

```bash
git clone https://github.com/evanbuggy/ranked-frontend.git
cd ranked-frontend
npm install
cp .env.example .env   # set VITE_API_BASE=http://localhost:8080
npm run dev
```

Run the **backend on port 8080** in another terminal. Open the URL Vite prints (usually `http://localhost:5173`).

Push / two-repo notes: [../docs/PUSH-TO-TWO-REPOS.md](../docs/PUSH-TO-TWO-REPOS.md) · API / CORS: [../docs/FRONTEND-BACKEND-INTEGRATION.md](../docs/FRONTEND-BACKEND-INTEGRATION.md)

### Optional: embed UI into a local Spring `static/` folder (monorepo only)

From a layout where this `frontend/` sits next to `backend/`:

```bash
npm run build:to-backend
```

Then start Spring from `backend/` — UI at `http://localhost:8080/`.

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE` | Backend URL, no trailing slash (e.g. `http://localhost:8080`) |
| `VITE_API_RELATIVE=1` | Use `/api` + Vite dev proxy (see `vite.config.js`) |

---

# Contributing

(Put VC practices and etiquette here, more info later with more CI/CD tools)

## Windows

The easiest way to develop on Windows is through WSL with Ubuntu. See [Microsoft’s WSL install guide](https://learn.microsoft.com/en-us/windows/wsl/install).

## Visual Studio Code and WSL

The [WSL extension](https://code.visualstudio.com/docs/remote/wsl) for VS Code makes development in your Linux environment much easier.

## Dependencies

### Node Version Manager (NVM)

1. `sudo apt-get update`
2. `sudo apt install curl`
3. `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash` — then `nvm install --lts`

### NPM

1. Clone this repo.
2. `npm install`
3. `npm run dev`

## Building with Docker

We use Docker for deployment. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (works with WSL). Then:

```bash
docker compose up -d --build
```

`docker compose down` stops containers. `docker ps -a` lists containers.
