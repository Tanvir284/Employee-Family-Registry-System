# Cloud Deployment Guide

Your project is now configured for cloud deployment! Follow these steps to get it live.

## 1. Setup Cloud Database (Recommended: Supabase)
Since your current database is local, you need a cloud instance.
1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  In **Project Settings > Database**, find your **Connection string (URI)**.
3.  Save this string; you'll need it for the backend environment variables.

## 2. Deploy Backend (Render.com)
1.  Log in to [Render](https://render.com/) and click **New > Web Service**.
2.  Connect your GitHub repository: `Tanvir284/Employee-Family-Registry-System`.
3.  **Root Directory**: `backend`
4.  **Runtime**: `Docker` (Render will detect .NET if you use a Dockerfile, or use `Native` if available).
    *   *Self-Correction*: Since we don't have a Dockerfile, select **Native (.NET)**.
    *   **Build Command**: `dotnet build`
    *   **Start Command**: `dotnet run` (or point to the compiled .dll).
5.  **Environment Variables**:
    *   `ConnectionStrings__DefaultConnection`: [Your Supabase URI]
    *   `Jwt__Secret`: [A long random string]
    *   `AllowedOrigins`: `https://your-vercel-app.vercel.app` (Add this after frontend is deployed).

## 3. Deploy Frontend (Vercel)
1.  Log in to [Vercel](https://vercel.com/) and click **Add New > Project**.
2.  Import your GitHub repository.
3.  **Root Directory**: `frontend`
4.  **Build Command**: `npm run build`
5.  **Install Command**: `npm install`
6.  **Environment Variables**:
    *   `VITE_API_URL`: `https://your-render-api.onrender.com/api`

## 4. Final Sync
Once the backend is live, update the `AllowedOrigins` in Render with your Vercel URL to enable CORS.
