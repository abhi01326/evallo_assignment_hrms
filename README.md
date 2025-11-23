# HRMS Project

## Overview

The Human Resource Management System (HRMS) is a full-stack application designed to manage employee and team information efficiently. This project utilizes Node.js for the backend, React.js for the frontend, and a SQL database for data storage.

## Project Structure

The project is organized into three main directories: `backend`, `frontend`, and `sql`.

### Backend

- **`backend/package.json`**: Configuration for the backend Node.js application, including dependencies and scripts.
- **`backend/.env.example`**: Template for environment variables needed for the backend application.
- **`backend/src/index.js`**: Entry point of the backend application, initializing the Express server and connecting to the database.
- **`backend/src/db/`**: Contains database connection logic and SQL schema.
- **`backend/src/controllers/`**: Contains controller functions for authentication, employees, and teams.
- **`backend/src/models/`**: Defines models for users, employees, and teams.
- **`backend/src/routes/`**: Defines API routes for authentication and resource management.
- **`backend/src/middleware/`**: Contains middleware for user authentication.
- **`backend/src/utils/`**: Utility functions for JWT handling.

### Frontend

- **`frontend/package.json`**: Configuration for the frontend React.js application, including dependencies and scripts.
- **`frontend/.env.example`**: Template for environment variables needed for the frontend application.
- **`frontend/public/index.html`**: Main HTML file for the React application.
- **`frontend/src/`**: Contains the main application logic, components, pages, and styles.

### SQL

- **`sql/migrations/`**: Contains SQL migration scripts for creating necessary tables.
- **`sql/seeds/`**: Contains SQL seed data for populating the database with initial data.

## Setup Instructions

### Backend

1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and configure your environment variables.
4. Run the server:
   ```
   npm start
   ```

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and configure your environment variables.
4. Run the application:
   ```
   npm start
   ```

## Usage

- Access the backend API at `http://localhost:3002/` (or the value of `PORT` in `backend/.env`).
- Access the frontend application at `http://localhost:3001/`.

When you run `backend/npm run init-db` the script will seed a demo user and sample teams/employees. Use `admin@example.com` / `devpassword` to log in.

## Hosting / Deployment

Below are simple options to host this project. I added `Dockerfile`s and a `docker-compose.yml` so you can run the full stack locally or deploy the containers to any provider that supports Docker.

Local Docker Compose (quick):

```bash
# build and start services
docker compose up --build -d

# view logs
docker compose logs -f

# stop services
docker compose down
```

Notes:
- Backend exposes port `3000` (mapped to host `3000`).
- Frontend is served by `nginx` on port `80` inside the container and mapped to host `5173` by the compose file.
- The backend SQLite DB is stored in a Docker volume named `backend-data` (persisted between runs).

Deploying to a cloud provider:

- Vercel: only for the frontend. Connect your GitHub repo to Vercel and it will detect the Vite app. Set `VITE_API_BASE` in Vercel environment variables to your backend URL.
- Render / Railway / Fly / Heroku: can host the backend (Node) and optionally the frontend as a static site. Connect the repo and configure a service for the `backend` directory. For SQLite-based deployments, prefer persistent filesystem (Render has a persistent disk) or switch to a managed DB.
- Docker-friendly hosts (DigitalOcean App Platform, Render via Docker, AWS ECS, Azure App Service with Docker): use the provided `Dockerfile`s and `docker-compose.yml` as a starting point.

Render quick-deploy (recommended for backend)
--------------------------------------------

I recommend using Render to host the backend if you want a simple managed deployment with persistent disk options. Steps:

1. Sign in to Render and create a new Web Service.
2. Connect your GitHub repo `abhi01326/evallo_assignment_hrms` and choose branch `main`.
3. Set the service's root directory to `backend` and start command to `node src/index.js`.
4. For persistent SQLite storage, enable a persistent disk on the service; otherwise switch to Postgres for production.
5. Create a Render API key in your Render dashboard and copy it.
6. In your GitHub repo settings, add repository secrets:
   - `RENDER_API_KEY` = your Render API key
   - `RENDER_SERVICE_ID` = the Render Service ID (from the service settings URL or API)

Once those secrets are set, the GitHub Actions workflow will automatically build images and trigger a Render deploy on pushes to `main`.

I've included a sample `render.yaml` manifest in the repo to help set up services quickly.

CI/CD ideas:
- Create a GitHub Actions workflow to build and publish Docker images to GitHub Container Registry or Docker Hub, then deploy to your chosen host. Secrets (registry credentials, deployment tokens) will be required.

Automatic build & deployment (GitHub Actions)
-------------------------------------------

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that runs on pushes to `main` and does the following:

- Builds Docker images for `backend` and `frontend` and pushes them to GitHub Container Registry (GHCR) as:
   - `ghcr.io/<owner>/<repo>-backend:latest`
   - `ghcr.io/<owner>/<repo>-frontend:latest`

- Builds the `frontend` using Vite and deploys the `dist` folder to GitHub Pages.

Requirements / repository settings:
- Ensure GitHub Pages is enabled for this repository (Pages will be served from the `gh-pages` deployment created by the action).
- The workflow uses `GITHUB_TOKEN` to push images to GHCR; depending on your org settings you may need to enable `packages: write` permission for workflows in repository settings.

Customizing the workflow:
- To change image names or tags, edit `.github/workflows/deploy.yml`.
- To deploy frontend elsewhere (Vercel/Netlify), remove the Pages job and set up the provider's GitHub integration or use provider-specific deploy actions.



## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
