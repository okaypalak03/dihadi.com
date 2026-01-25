# dihadi.com

A web application that connects users with local workers for various services. Think Zomato/Swiggy-style platform—but for hiring workers instead of ordering food.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, React Router 7, Axios |
| **Backend** | Node.js, Express 5, ES Modules |
| **Database** | MongoDB (Mongoose) |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |

## Features

- **Worker profiles** — Workers create and manage profiles with skills, availability, and charges
- **Area-based search** — Find workers by location
- **Hiring flow** — “Add to Hire”–style booking
- **Job lifecycle** — Track status: Pending → Accepted → Completed
- **Mock payments** — Simulated payment flow for completed jobs
- **Role-based access** — Separate dashboards for **Users**, **Workers**, and **Admins**
- **Profile photos** — Upload and display worker photos

## Project Structure

```
dihadi.com/
├── backend/           # Express API
│   ├── config/        # DB connection
│   ├── controllers/   # Auth, users, workers, jobs, admin
│   ├── middleware/    # Auth & JWT
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   └── index.js       # Entry point
├── frontend/          # React + Vite app
│   ├── public/
│   └── src/
│       ├── components/   # UI (Navbar, Footer, modals, etc.)
│       ├── context/      # AuthContext
│       ├── pages/        # Home, Login, Register, dashboards
│       └── utils/
└── README.md
```

## Prerequisites

- **Node.js** (v18+)
- **npm**
- **MongoDB** (local or Atlas)

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
```

Start the API:

```bash
npm start
```

Runs with **nodemon** on `http://localhost:5000`. API base: `http://localhost:5000/api`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite dev server runs (typically `http://localhost:5173`). The app calls the backend at `http://localhost:5000/api`.

### 3. Run both

1. Start **backend** first (`cd backend && npm start`).
2. Start **frontend** in another terminal (`cd frontend && npm run dev`).
3. Open the frontend URL in your browser.

## API Overview

| Base path | Purpose |
|-----------|---------|
| `/api/auth` | Login, register, `/me` |
| `/api/users` | User profile, etc. |
| `/api/workers` | Worker CRUD, search by area |
| `/api/jobs` | Create, update, list jobs |
| `/api/admin` | Admin-only actions |

## Scripts

**Backend** (`backend/package.json`):

- `npm start` — Run with nodemon
- `npm run server` — Run with plain `node`

**Frontend** (`frontend/package.json`):

- `npm run dev` — Vite dev server
- `npm run build` — Production build
- `npm run preview` — Preview production build
- `npm run lint` — ESLint

## Deployment

To deploy on **Render.com**, see **[DEPLOY.md](./DEPLOY.md)**. It covers:

- Deploying the backend as a **Web Service**
- Deploying the frontend as a **Static Site**
- MongoDB Atlas, env vars (`MONGODB_URI`, `JWT_SECRET`, `VITE_API_URL`), and troubleshooting

## License

ISC
