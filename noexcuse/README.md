# NoExcuse.ai — AI-Powered Habit Tracking Platform

> **No Excuses. Just Results.**  
> The complete SaaS-ready habit tracker with AI coaching, social feed, DMs, leaderboards, analytics, and nightly email summaries.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS (neon theme), Recharts, Framer Motion, React Router v6 |
| Backend | Node.js, Express.js, MongoDB + Mongoose, JWT, bcryptjs |
| AI | OpenAI GPT-3.5-turbo (built-in smart fallback — works without key) |
| Email | Nodemailer + Gmail SMTP (8 notification types) |
| Scheduling | node-cron (9:30 PM daily summary) |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Features

### Core
- **10 Daily Habits** with custom icon, color, XP reward
- **Monthly Habit Grid** — visual tracker with streak highlights
- **Streak System** — auto-calculated, reset on miss
- **XP & Level System** — earn XP per habit, level up
- **Discipline Score** — rolling 7-day average completion %
- **12 Achievement Badges** — unlocked automatically

### Analytics
- **30/60/90-day trend graphs** — score, completion, XP
- **Weekday Activity Bar Chart** — best days of the week
- **Category Pie Chart** — what you focus on most
- **Completion Heatmap** — GitHub-style daily grid
- **Key Metrics** — perfect days, active days, avg score

### Plan Mode
- Create 30/60/90-day goal plans
- Add milestones with priority (low/medium/high)
- Progress bar per plan
- Deadline tracking with dates

### Social (Instagram-style)
- **Feed** — posts, reels, shorts from people you follow
- **Explore** — discover top posts globally
- **Post Types** — Post, Reel, Short, streak milestone auto-posts
- **Likes, Comments, Saves**
- **Follow / Unfollow** users
- **Direct Messages** — full DM system with conversation history
- **Search** — find users by @username or name
- **Public Profiles** — view anyone's stats, streak, posts

### Email Notifications (8 types)
1. **Welcome** — on signup, with full feature overview
2. **Signup Confirmation** — account active confirmation
3. **Login Alert** — every login with IP, device, time
4. **Goal Added** — when a new habit is created
5. **Goal Completed** — when a habit is checked off (with badges, level-up, progress)
6. **Daily Summary** — nightly AI analysis, habit breakdown, XP, badges, heatmap
7. **New Follower** — when someone follows you
8. **New Message** — when you receive a DM

### AI Coach
- GPT-3.5 daily summaries (with smart fallback if no key)
- Performance analysis, improvement advice, motivation quote
- Stored in DB, shown in dashboard and nightly email

### Leaderboard
- Global XP ranking (top 50)
- Global streak ranking
- Your rank highlighted

---

## Project Structure

```
noexcuse-ai/
├── backend/
│   ├── models/        User, Habit, DailyLog, SocialPost, Message, Plan
│   ├── routes/        auth, habits, logs, users, leaderboard, social, messages, plans, ai
│   ├── middleware/    auth.js (JWT)
│   ├── utils/         aiService.js, badges.js
│   ├── emails/        mailer.js (8 email types)
│   ├── cron/          dailyJob.js (9:30 PM)
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/     Landing, Login, Signup, Dashboard, Analytics, Plans,
│       │              Social, Messages, Leaderboard, Profile, Search, UserProfile
│       ├── components/layout/AppLayout  dashboard/  ui/
│       ├── hooks/     useHabits, useTodayLog
│       ├── context/   AuthContext
│       └── lib/       api.js
└── README.md
```

---

## Quick Start (Local)

### Requirements
- Node.js 18+
- MongoDB Atlas (free tier works: [cloud.mongodb.com](https://cloud.mongodb.com))
- Gmail account for emails (optional)
- OpenAI API key (optional — app works without it)

### 1. Install dependencies

```bash
cd noexcuse-ai
npm run install:all
```

### 2. Configure backend

```bash
cd backend
cp .env.example .env
# Open .env and fill in your values
```

Minimum required `.env`:
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/noexcuse
JWT_SECRET=any_long_random_string_here
```

### 3. Configure frontend (optional)

```bash
cd frontend
cp .env.example .env
# Default /api works for local dev via Vite proxy — no changes needed
```

### 4. Run

Open **two terminals**:

```bash
# Terminal 1 — Backend (port 5000)
npm run dev:backend

# Terminal 2 — Frontend (port 5173)
npm run dev:frontend
```

Open **http://localhost:5173** — done.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Any long random string (min 32 chars) |
| `PORT` | — | Defaults to 5000 |
| `CLIENT_URL` | — | Frontend URL for CORS & email links |
| `MAIL_USER` | — | Gmail address |
| `MAIL_PASS` | — | Gmail App Password (see below) |
| `OPENAI_API_KEY` | — | GPT-3.5 key for AI summaries |

### Gmail App Password Setup
1. Enable 2FA on your Google account
2. Go to **Google Account → Security → App Passwords**
3. Create a password for "Mail"
4. Use the 16-character code as `MAIL_PASS`

---

## Deploy to Production

### Backend → Render (free tier)

1. Push to GitHub
2. [render.com](https://render.com) → **New Web Service**
3. Connect your repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add all environment variables
6. Deploy

### Frontend → Vercel (free tier)

1. [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Vite
   - **Build**: `npm run build`
   - **Output**: `dist`
4. Add env variable:
   - `VITE_API_URL` = `https://your-app.onrender.com/api`
5. Deploy

---

## XP & Level System

```
Level 1 → 2:  100 XP
Level 2 → 3:  200 XP
Level N → N+1: N × 100 XP
```

Each habit completion earns 5–30 XP (set per habit).

## Badge System

| Badge | Condition |
|---|---|
| 🌱 First Step | Complete first habit |
| 🔥 Week Warrior | 7-day streak |
| ⚡ Fortnight Force | 14-day streak |
| 👑 Month Master | 30-day streak |
| 🎯 Half Century | 50-day streak |
| 💯 Century Club | 100 habits completed |
| ⭐ Rising Star | Level 5 |
| 🏆 Elite Performer | Level 10 |
| 🌟 Legend | Level 20 |
| 🦾 Iron Discipline | 90%+ discipline score |
| 🤝 Connector | Follow 5 users |
| 💎 1K Club | 1,000 XP |

---

*NoExcuse.ai © 2025 — No Excuses. Just Results. Made in the USA.*
