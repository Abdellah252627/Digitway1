# Railway Deployment Guide

## Prerequisites
- Railway account (railway.app)
- Railway CLI installed: `npm install -g @railway/cli`
- Turso account (turso.tech) — free tier available

---

## Step 1: Create Turso Database (Cloud SQLite)

### Install Turso CLI
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### Login to Turso
```bash
turso auth login
```

### Create Database
```bash
turso db create digitway
```

### Get Database URL
```bash
turso db show digitway
```
Output: `libsql://digitway-abdellah.turso.io` (save this!)

### Create Auth Token
```bash
turso db tokens create digitway
```
Output: `eyJh...` (save this!)

### Verify Connection
```bash
turso db shell digitway "SELECT 1;"
```

---

## Step 2: Login to Railway
```bash
railway login
```

---

## Step 3: Initialize Railway Project
```bash
cd server
railway init
```

---

## Step 4: Set Environment Variables
In Railway dashboard → your service → Variables, add:

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `PORT` | `8080` | `8080` (Railway default) |
| `ADMIN_EMAIL` | Your admin email | `hello.northstack2@gmail.com` |
| `JWT_SECRET` | Strong random secret | `da61a48aed5e...` |
| `TURSO_DATABASE_URL` | From Step 1 | `libsql://digitway-abdellah.turso.io` |
| `TURSO_AUTH_TOKEN` | From Step 1 | `eyJh...` |
| `SMTP_HOST` | Gmail SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USER` | Your Gmail | `hello.northstack2@gmail.com` |
| `SMTP_PASS` | Gmail App Password | `xxxx xxxx xxxx xxxx` |
| `TELEGRAM_BOT_TOKEN` | Optional | `123456:ABC...` |
| `TELEGRAM_CHAT_ID` | Optional | `-1001234567890` |
| `ADMIN_URL` | Your Vercel URL | `https://digitway.vercel.app/admin` |

---

## Step 5: Deploy
```bash
railway up
```

---

## Step 6: Get Your Railway URL
```bash
railway domain
```
This gives you: `https://digitway-api.up.railway.app`

---

## Step 7: Configure Vercel (Frontend)

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://digitway-api.up.railway.app`
3. Update `client/vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://digitway-api.up.railway.app/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
4. Redeploy on Vercel

---

## Health Check
Your API health check is at: `https://digitway-api.up.railway.app/api/health`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `405 Method Not Allowed` | Check `vercel.json` proxy rewrite |
| `JWT_SECRET is required` | Add JWT_SECRET to Railway variables |
| `Database connection failed` | Verify TURSO_DATABASE_URL and TURSO_AUTH_TOKEN |
| `SMTP auth error` | Use Gmail App Password, not your regular password |
| `CORS error` | Ensure frontend URL is allowed (origin: true in server.js) |
