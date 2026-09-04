# AGENTS.md - Project Continuation Guide

## IMPORTANT: COMMUNICATION STYLE
**Always talk in Taglish (mix of Tagalog and English) with the user. Example: "Gagawin ko na ang frontend", "Ano next na gagawin natin?"**

## Project: Automated Google Classroom Activity Reminder

### Overview
A web application that connects to Google Classroom, syncs courses and activities, and sends automated reminders for upcoming deadlines.

---

## COMPLETED ✅

### Backend (`backend/` folder)
- **Framework:** Express.js + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** JWT + Google OAuth 2.0
- **Automation:** node-cron (daily reminders at 9AM, hourly overdue check)

#### How to run backend:
```powershell
cd "C:\Users\burgo_w8uuyg3\OneDrive\Desktop\Automated-Google-Classroom-Activity-Reminder\backend"
npm install
npx prisma generate
npx prisma db push
npx ts-node src/server.ts
```
Server runs on `http://localhost:3000`

#### API Endpoints:
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/google | Google OAuth URL | No |
| GET | /api/auth/google/callback | Google OAuth callback | No |
| GET | /api/auth/me | Get current user | Yes |
| POST | /api/auth/logout | Logout | Yes |
| GET | /api/dashboard | Dashboard stats | Yes |
| GET | /api/classrooms | List classrooms | Yes |
| POST | /api/classrooms | Create classroom | Yes |
| GET | /api/classrooms/:id | Get classroom | Yes |
| PUT | /api/classrooms/:id | Update classroom | Yes |
| DELETE | /api/classrooms/:id | Delete classroom | Yes |
| POST | /api/classrooms/sync | Sync from Google | Yes |
| GET | /api/activities | List activities | Yes |
| POST | /api/activities | Create activity | Yes |
| GET | /api/activities/upcoming | Upcoming activities | Yes |
| GET | /api/activities/overdue | Overdue activities | Yes |
| GET | /api/activities/:id | Get activity | Yes |
| PUT | /api/activities/:id | Update activity | Yes |
| DELETE | /api/activities/:id | Delete activity | Yes |
| POST | /api/activities/sync/:classroomId | Sync from Google | Yes |
| GET | /api/notifications | List notifications | Yes |
| GET | /api/notifications/unread | Unread count | Yes |
| PUT | /api/notifications/:id/read | Mark as read | Yes |
| PUT | /api/notifications/read-all | Mark all read | Yes |
| DELETE | /api/notifications/:id | Delete notification | Yes |
| GET | /api/preferences | Get preferences | Yes |
| PUT | /api/preferences | Update preferences | Yes |

#### Auth Header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## IN PROGRESS 🔄

### Frontend (`Automated-Google-Classroom-Activity-Reminder-main/` folder)
- **Framework:** React 19 + Vite 8 + TypeScript
- **Styling:** Tailwind CSS 4 + shadcn/ui
- **State:** Zustand
- **Data Fetching:** TanStack React Query
- **Routing:** React Router DOM v7
- **Calendar:** FullCalendar

**STATUS:** Scaffolded only - `src/` folder does NOT exist yet. No React code written.

**ASSIGNED TO:** Teammate (NOT the user)

**Frontend folder path:**
```
C:\Users\burgo_w8uuyg3\OneDrive\Desktop\Automated-Google-Classroom-Activity-Reminder\Automated-Google-Classroom-Activity-Reminder-main\Automated-Google-Classroom-Activity-Reminder-main
```

#### Frontend API Reference (for teammate):
- Base URL: `http://localhost:3000`
- Auth: JWT Bearer token in Authorization header
- Login: `POST /api/auth/login` → `{ email, password }` → `{ token, user }`
- Register: `POST /api/auth/register` → `{ email, password, name }` → `{ token, user }`
- Google Auth: `GET /api/auth/google` → `{ url }` (redirect user to this URL)
- Profile: `GET /api/auth/me` (with auth header)
- Dashboard: `GET /api/dashboard`
- Classrooms: `GET /api/classrooms`, `POST /api/classrooms/sync`
- Activities: `GET /api/activities`, `POST /api/activities`, `GET /api/activities/upcoming`, `GET /api/activities/overdue`
- Notifications: `GET /api/notifications`, `GET /api/notifications/unread`, `PUT /api/notifications/:id/read`
- Preferences: `GET /api/preferences`, `PUT /api/preferences`

---

## DATABASE CONFIG

### PostgreSQL Connection:
```
Host: localhost
Port: 5432
Database: classroom_reminder
Username: postgres
Password: MERV1234
URL: postgresql://postgres:MERV1234@localhost:5432/classroom_reminder?schema=public
```

### psql command:
```powershell
& "C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -p 5432
\c classroom_reminder
```

### Prisma Schema Location:
`backend/prisma/schema.prisma`

### Tables:
- User (id, email, name, avatar, googleId, accessToken, refreshToken)
- UserPreference (userId, emailNotifications, studyReminders, reminderTime, timezone, reminderDaysBefore)
- Classroom (userId, googleClassroomId, name, section, description, alternateLink)
- Activity (userId, classroomId, googleActivityId, title, description, type, dueDate, dueTime, maxPoints, status, alternateLink)
- Notification (userId, activityId, type, title, message, sentAt, read)

---

## GOOGLE OAUTH CONFIG

### Google Cloud Console Project: classroom-reminder
- **Client ID:** `YOUR_GOOGLE_CLIENT_ID`
- **Client Secret:** `YOUR_GOOGLE_CLIENT_SECRET`
- **Redirect URI:** http://localhost:3000/api/auth/google/callback
- **Scopes:**
  - classroom.courses.readonly
  - classroom.coursework.me.readonly
  - classroom.student-submissions.me.readonly
  - userinfo.email
  - userinfo.profile

### Google OAuth Flow:
1. GET /api/auth/google → returns { url: "google auth url" }
2. User opens URL in browser → logs in → clicks Allow
3. Google redirects to /api/auth/google/callback with code
4. Backend exchanges code for tokens → creates/updates user → returns JWT token

---

## TEAM INFO

- **GitHub Org:** cjmarvteam
- **Repo:** https://github.com/cjmarvteam/Automated-Google-Classroom-Activity-Reminder
- **User Email:** 24-64674@g.batstate-u.edu.ph
- **User Name:** MARVIN LAURENCE BURGOS
- **Role:** Backend developer
- **Teammates:** Handling frontend

---

## IMPORTANT NOTES

1. The `.env` file in `backend/` contains secrets - DO NOT commit to git (already in .gitignore)
2. Backend uses Prisma - after any schema change run `npx prisma db push`
3. Google OAuth only works with published consent screen
4. The `src/` folder in root is the OLD Mongoose-based code - IGNORE IT. Use `backend/` folder instead.
5. Automation starts automatically when server starts (daily reminders at 9AM, hourly overdue check)
