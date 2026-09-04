# Deployment Guide

## Railway (Backend)

### Step 1: Create Railway Account
1. Go to https://railway.com
2. Sign up with GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub Repo"
3. Select this repository
4. Select the `backend` folder as root

### Step 3: Add PostgreSQL Database
1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will auto-generate `DATABASE_URL`

### Step 4: Set Environment Variables
Go to your backend service → Variables tab → Add:

```
NODE_ENV=production
JWT_SECRET=your_random_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-url.up.railway.app/api/auth/google/callback
FRONTEND_URL=https://your-frontend-url.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Step 5: Get Backend URL
1. Go to your backend service → Settings
2. Copy the public domain (e.g., `https://classroom-api.up.railway.app`)

---

## Vercel (Frontend)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### Step 2: Import Project
1. Click "New Project"
2. Import this GitHub repository
3. Framework: Vite
4. Root Directory: `frontend`

### Step 3: Set Environment Variable
Go to Settings → Environment Variables → Add:

```
VITE_API_URL=https://your-backend-url.up.railway.app
```

### Step 4: Deploy
Click "Deploy" and wait for build to complete.

---

## Google OAuth Update

After deployment, update Google Cloud Console:
1. Go to https://console.cloud.google.com
2. APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add Authorized Redirect URI:
   `https://your-backend-url.up.railway.app/api/auth/google/callback`
5. Add Authorized JavaScript Origin:
   `https://your-frontend-url.vercel.app`
