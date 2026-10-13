# Hale — E-Commerce Project

See **PROJECT_PROGRESS.md** for full status, decisions and the next phase to
run — it's the source of truth for every future Claude session on this
project.

## Quick start

**Frontend** (React + Vite — works standalone with its own placeholder data):

```bash
cd frontend
npm install
npm run dev
```

Then open the URL Vite prints (typically http://localhost:5173).

**Backend** (Node.js + Express + MySQL API — not yet wired to the frontend,
see PROJECT_PROGRESS.md):

```bash
cd backend
npm install
cp .env.example .env   # then edit with your MySQL credentials
npm run db:schema      # create tables
npm run db:seed        # seed the same placeholder catalog the frontend uses
npm run dev
```

See `backend/README.md` for full setup details, demo login credentials, and
an API endpoint reference.

## Structure

```
ecommerce-project/
├── PROJECT_PROGRESS.md   ← read this first, every session
├── frontend/              ← React + Vite + JS app
└── backend/               ← Node.js + Express + MySQL API
```
