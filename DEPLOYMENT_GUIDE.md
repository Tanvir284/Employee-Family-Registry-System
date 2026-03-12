# Cloud Deployment Guide

This project can be deployed directly from the included `render.yaml` (recommended) or manually.

## Quick Deploy (Recommended)

1. Push this repository to GitHub.
2. In Render, click **New +** → **Blueprint**.
3. Select your repository and deploy.
4. After the services are created, set required secret environment variables in Render:
   - `ConnectionStrings__DefaultConnection` (backend)
   - `VITE_API_URL` (frontend, e.g. `https://employee-registry-api.onrender.com/api`)

The blueprint creates:
- `employee-registry-api` (Docker service from `backend/Dockerfile`)
- `employee-registry-frontend` (Static site from `frontend/dist`)

## Manual Backend Deployment (Render)

1. Create a new **Web Service**.
2. Runtime: **Docker**.
3. Root Directory: `backend`.
4. Dockerfile Path: `backend/Dockerfile`.
5. Set env vars:
   - `ConnectionStrings__DefaultConnection`
   - `Jwt__Secret`
   - `AllowedOrigins` (set to frontend domain in production)

## Manual Frontend Deployment (Render Static or Vercel)

### Render Static Site
- Root Directory: `frontend`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`
- Env var: `VITE_API_URL=https://<your-backend-domain>/api`
- Rewrite: `/* -> /index.html`

### Vercel
- Root directory: `frontend`
- Build command: `npm run build`
- Install command: `npm install`
- Env var: `VITE_API_URL=https://<your-backend-domain>/api`

## Important Production Notes

- Do **not** commit real database passwords or connection strings into `render.yaml`.
- Restrict backend `AllowedOrigins` to your frontend domain instead of `*`.
- If migrations are enabled on startup, ensure database credentials are valid before first boot.
