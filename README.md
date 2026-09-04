# Automated Google Classroom Activity Reminder

A full-stack application for organizing Google Classroom activities and sending
automated deadline reminders.

## Live Application

- Frontend: https://frontend-delta-drab-98.vercel.app
- Backend health: https://classroom-reminder-api-production.up.railway.app/health

## Repository Structure

```text
.
├── backend/   # Express, TypeScript, Prisma, and PostgreSQL API
├── frontend/  # React, TypeScript, and Vite web application
├── AGENTS.md  # Project context and maintenance guidance
└── DEPLOY.md  # Railway and Vercel deployment instructions
```

The active backend is entirely inside `backend/`. Railway builds it using its
Dockerfile, synchronizes the Prisma schema, and then starts the Express server.
The frontend is entirely inside `frontend/` and uses `VITE_API_URL` to connect
to the Railway API.

## Local Development

### Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Copy `backend/.env.example` to `backend/.env` and supply your own development
credentials. Never commit the `.env` file.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend development server runs at `http://localhost:5173` and proxies API
requests to the local backend.

## Production Deployment

See [DEPLOY.md](DEPLOY.md) for Railway, PostgreSQL, Vercel, and Google OAuth
configuration.
