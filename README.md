# Digitway — Freelance Services Marketing Website & Admin Panel

A high-converting multi-page marketing platform for a freelance MERN developer to acquire clients, paired with a private, authenticated administrative suite.

---

## 🎨 Design System & Color Palette
- **Primary Dark Green**: `#173404`
- **Primary Mid Green**: `#3B6D11`
- **Accent Bright Green**: `#639922`
- **Neutral Light Background**: `#F1EFE8`
- **Neutral Dark Surface / Text**: `#2C2C2A` / `#151712`
- **Typography**: Plus Jakarta Sans / Inter for English, Cairo / Tajawal for Arabic.
- **Bilingual & RTL**: Full English (`/en/...`) and Arabic (`/ar/...`) localization with globe language switcher in header and complete RTL directional mirroring.

---

## 🌐 Public Multi-Page Site Architecture

| Route | Page | Description |
|---|---|---|
| `/:lang` | **Home** | Hero with live availability badge, 3 core services preview with starting prices, 4-step process highlight, demo previews, testimonials, conversion CTA banner. |
| `/:lang/services` | **Services Index** | Comprehensive service cards and comparison matrix explaining why hiring a senior MERN engineer delivers superior ROI over agencies. |
| `/:lang/services/landing-pages` | **Landing Pages** | Sub-service page ($400, 3-5 days turnaround, <800ms load time, Core Web Vitals, lead forms, direct CTA). |
| `/:lang/services/dashboards` | **Dashboards & SaaS** | Sub-service page ($1,200, 2-3 weeks, fullstack MERN, RBAC auth, interactive analytics charts, direct CTA). |
| `/:lang/services/ecommerce` | **E-Commerce Stores** | Sub-service page ($900, 1-2 weeks, custom cart drawer, Stripe/PayPal checkout, lightweight CMS, direct CTA). |
| `/:lang/portfolio` | **Portfolio** | Interactive showcase of **Atelier** (Architecture showcase), **Fleet** (Logistics GPS dashboard), **Orbit** (SaaS subscription billing), and **Nutri** (Health meal-prep store) with filters and demo links. |
| `/:lang/process` | **Process & FAQs** | 4-step transparent workflow: *Discovery & Scoping* → *UI/UX & Architecture* → *Agile Build & Staging Demos* → *Deployment & 30-Day Warranty*, plus client FAQs. |
| `/:lang/contact-links` | **Contact Links** | Clean hub for direct communication channels: WhatsApp direct chat, LinkedIn, Instagram, GitHub, and 1-click email copy. |
| `/:lang/reviews` | **Reviews** | Public list of **approved** client reviews with 5-star cards + interactive "Leave a Review" modal (submitted reviews go to `pending` queue for moderation). |
| `/:lang/quote` | **Get a Quote** | Structured request form (Project name, service type picker, budget selector, timeline, client coordinates). Submissions trigger in-panel + Telegram alerts! |

---

## 🔐 Admin Management Suite (`/admin`)

- **Claude-Style Passwordless Login (`/admin/login`)**:
  - Email-first input (`admin@digitway.com`).
  - 6-digit OTP security code dispatched to email (logged in development with a 1-click auto-fill test button).
  - Issues secure JWT session tokens (7-day validity).
- **Executive Overview (`/admin`)**:
  - Real-time counters: Active Projects, New Quote Requests, Pending Reviews, Completed Projects.
  - Quick action shortcuts + Recent activity timeline.
- **Confidential Projects CRM (`/admin/projects`)**:
  - Real client projects management with status (`in_discussion`, `in_progress`, `completed`, `on_hold`).
  - Progress percentage meters, contract budget, start & target delivery dates, client email/phone, confidential notes.
  - Strictly confidential — never exposed in any public API.
- **Contact Requests / Quotes Manager (`/admin/quotes`)**:
  - Incoming `/quote` submissions with unread badges and status filters (`new`, `contacted`, `converted`, `archived`).
  - Full scope brief viewer, direct WhatsApp chat, and 1-click **"Convert to Project"** feature.
- **Content Editor CMS (`/admin/content`)**:
  - Lightweight marketing CMS to edit hero headlines (EN & AR), starting prices, delivery timelines, contact links, and availability badge in real time.
- **Review Moderation Queue (`/admin/reviews`)**:
  - Pending reviews queue with **Approve & Publish**, **Reject**, **Feature**, **Edit**, or **Delete** actions.
- **In-Panel & Telegram Notifications**:
  - Header bell icon with live unread badge and dropdown list of new quotes & reviews.
  - Telegram Bot alerts for real-time notifications on your phone for new quotes and pending reviews.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ (Tested on v24)
- npm 9+

### 1. Install Dependencies
```bash
# Install backend and frontend dependencies
npm run install:all
```

### 2. Configure Environment Variables
Copy `server/.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```
*(Optional: add your `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to receive live Telegram notifications on your phone!)*

### 3. Run Development Server
```bash
# Runs both Backend (port 5000) and Frontend (port 5173) concurrently:
npm run dev
```

- **Public Marketing Website**: [http://localhost:5173/en](http://localhost:5173/en) or [http://localhost:5173/ar](http://localhost:5173/ar)
- **Admin Portal**: [http://localhost:5173/admin](http://localhost:5173/admin) (Default email: `admin@digitway.com`)

---

## 🛠 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6.
- **Backend**: Node.js, Express, SQLite (`better-sqlite3`), JSON Web Tokens (JWT), Nodemailer.
- **Integrations**: Telegram Bot API for real-time mobile notifications.
