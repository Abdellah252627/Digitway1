# Railway Deployment Guide

## Prerequisites
- Railway account (railway.app)
- Railway CLI installed: `npm install -g @railway/cli`
- Turso database created (for production database)

## Step 1: Login to Railway
```bash
railway login
```

## Step 2: Initialize Railway Project
```bash
cd server
railway init
```

## Step 3: Set Environment Variables
In Railway dashboard → your service → Variables, add:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `8080` (Railway default) |
| `ADMIN_EMAIL` | `hello.northstack2@gmail.com` |
| `JWT_SECRET` | (your secret) |
| `TURSO_DATABASE_URL` | `libsql://digitway-xxxx.turso.io` |
| `TURSO_AUTH_TOKEN` | (your Turso token) |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `hello.northstack2@gmail.com` |
| `SMTP_PASS` | (your Gmail App Password) |
| `TELEGRAM_BOT_TOKEN` | (optional) |
| `TELEGRAM_CHAT_ID` | (optional) |
| `ADMIN_URL` | `https://your-vercel-domain.vercel.app/admin` |

## Step 4: Deploy
```bash
railway up
```

## Step 5: Get Your URL
```bash
railway domain
```
This gives you: `https://digitway-api.up.railway.app`

## Step 6: Configure Vercel
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://digitway-api.up.railway.app`
3. Update `client/vercel.json` with the Railway URL
4. Redeploy on Vercel

## Health Check
Your API health check is at: `https://digitway-api.up.railway.app/api/health`
