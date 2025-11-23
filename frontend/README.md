# HRMS Frontend

This is a Vite + React + TypeScript frontend for the HRMS project. It uses Tailwind CSS and React Query.

Quick start

1. Install dependencies

```bash
cd frontend
npm install
```

2. Start dev server

```bash
npm run dev
```

By default the frontend expects the backend API at `http://localhost:3000/api`. You can set a different base URL by creating a `.env` file with `VITE_API_BASE`.

Notes

- Authentication token is stored in `localStorage` and attached to requests.
- The current backend supports single-team relation via `team_id` on employees. To support many-to-many, backend DB and API changes are required (see project notes).
