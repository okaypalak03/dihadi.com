# Deploy dihadi.com on Render.com

This guide walks you through deploying the **backend** (Node/Express API) and **frontend** (React/Vite) on [Render](https://render.com). Deploy the backend first, then the frontend.

---

## Prerequisites

1. **GitHub** – Your project is already pushed to a GitHub repo.
2. **MongoDB Atlas** – Use a cloud MongoDB instance (Render does not provide MongoDB).
   - Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
   - Get your connection string (e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dihadi?retryWrites=true&w=majority`).
   - Ensure your Atlas IP allowlist includes `0.0.0.0/0` (allow from anywhere) so Render can connect.
3. **Render account** – Sign up at [render.com](https://render.com) (free tier is enough to start).

---

## Part 1: Deploy the Backend (Web Service)

1. Log in to [Render](https://render.com) and click **New → Web Service**.

2. **Connect the repo**
   - Connect your GitHub account if needed.
   - Select the **dihadi.com** (or your repo) repository.

3. **Configure the service**
   - **Name:** `dihadi-api` (or any name you like).
   - **Region:** Choose the one closest to your users.
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Environment variables**  
   Add these (use **Add Environment Variable**):

   | Key | Value |
   |-----|--------|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A long random string (e.g. generate with `openssl rand -hex 32`) |

   Do **not** set `PORT`; Render sets it automatically.

5. **Create Web Service**  
   Click **Create Web Service**. Render will build and deploy.

6. **Note the backend URL**  
   Once deployed, you’ll see a URL like:
   ```
   https://dihadi-api.onrender.com
   ```
   The API base is **`https://dihadi-api.onrender.com/api`** (include `/api`). You’ll need this for the frontend.

7. **Optional – Always-on**  
   On the free tier, the service may spin down after inactivity. If you want it always on, upgrade the plan or use a cron job to ping it.

---

## Part 2: Deploy the Frontend (Static Site)

1. In the Render dashboard, click **New → Static Site**.

2. **Connect the repo**
   - Select the same GitHub repository.

3. **Configure the site**
   - **Name:** `dihadi-web` (or any name).
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

4. **Environment variables**  
   Add:

   | Key | Value |
   |-----|--------|
   | `VITE_API_URL` | `https://dihadi-api.onrender.com/api` |

   Replace `dihadi-api` with your **actual** backend service name from Part 1. It must include `/api` at the end.

5. **Create Static Site**  
   Click **Create Static Site**. Render will install deps, run `npm run build` (which uses `VITE_API_URL`), and publish the `dist` folder.

6. **Frontend URL**  
   After deploy, you’ll get a URL like:
   ```
   https://dihadi-web.onrender.com
   ```

7. **Client-side routing (SPA)**  
   React Router uses client-side routes (`/login`, `/user-dashboard`, etc.). Render’s Static Site serves `index.html` for all paths by default, so routes should work without extra config. If you ever see 404s on refresh, check Render’s “Rewrite” / “Redirect” options for SPAs.

---

## Part 3: Verify

1. Open your **frontend** URL (e.g. `https://dihadi-web.onrender.com`).
2. Register / log in, search workers, create jobs. All requests should go to your **backend** URL.
3. Check the **backend** service logs on Render if something fails (e.g. DB or auth errors).

---

## Summary

| Service | Type | Root | Build | Start / Publish |
|--------|------|------|--------|------------------|
| Backend | Web Service | `backend` | `npm install` | `npm start` |
| Frontend | Static Site | `frontend` | `npm install && npm run build` | `dist` |

**Important:** Set `VITE_API_URL` to your backend base URL **including** `/api`, e.g. `https://dihadi-api.onrender.com/api`.

---

## Troubleshooting

- **`nodemon: Permission denied` / `Exited with status 127`** – The backend `start` script must use `node index.js`, not `nodemon`. The repo is configured this way; ensure you haven’t overridden the start command on Render.
- **CORS errors** – The backend uses `cors()` with no origin restriction, so all origins are allowed. If you lock CORS down later, add your Render frontend URL.
- **“Cannot connect to MongoDB”** – Confirm `MONGODB_URI` is correct, Atlas IP allowlist includes `0.0.0.0/0`, and the user has read/write access to the DB.
- **Frontend 404 on refresh** – Ensure the static site is set up as an SPA (all routes → `index.html`).
- **Backend spin-down (free tier)** – The first request after idle can be slow. Use “Always-on” or another plan to avoid it.
