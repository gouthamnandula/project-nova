# NOVA Frontend

A React + TypeScript frontend for the NOVA project management API — create projects, invite teammates, and track tasks on a Kanban board.

Built with Vite, React 19, TypeScript, Tailwind CSS v4, and React Router.

---

## Design

The visual identity is a "flight-deck" theme: a deep navy base, a single warm amber accent for primary actions, soft blue for in-progress work, and teal-green for completed work. Headings use Fraunces (serif); UI text uses Inter.

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Point it at your backend

Copy the example env file and adjust if your backend runs somewhere other than `http://localhost:5000`:

```bash
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000
```

### 3. Run the backend

In a separate terminal, start the NOVA backend (see its own README for database setup):

```bash
cd path/to/backend
npm run dev
```

### 4. Run the frontend

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Available scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |

---

## Project structure

```text
src/
├── api/
│   └── client.ts          # Typed fetch wrapper for every backend endpoint
├── context/
│   └── AuthContext.tsx    # JWT auth state (login, register, logout, current user)
├── components/            # Reusable UI: buttons, fields, modals, badges, kanban, etc.
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── ProjectsDashboard.tsx
│   └── ProjectDetail.tsx  # Board + members tabs, stats, project settings
├── types/
│   └── index.ts           # Types mirroring the backend's Prisma models
├── App.tsx                # Routes
└── main.tsx
```

---

## Features

- **Auth** — register, log in, session restored from a stored JWT on reload
- **Projects** — create, rename, edit description, delete
- **Tasks** — create, edit, delete, reassign, change status/priority/due date, grouped into a To do / In progress / Done board
- **Members** — invite an existing NOVA user by email, remove members (owner only, owner can't be removed)
- **Stats** — live task counts and a completion progress bar per project

## Notes

- The backend's `createTask` endpoint always creates tasks as `TODO`; move a task to another column by opening it and changing its status.
- Only project owners can edit/delete the project, manage members, or see the "Add member" action — this mirrors the backend's ownership checks.
- The JWT is stored in `localStorage` under the key `nova.token`.
