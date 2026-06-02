# 01 — Project Planning

## Problem Statement

Build a full-stack URL Shortener application where users can create short links for long URLs and track basic analytics such as click count, creation date, and recent visits. The platform should allow authenticated users to manage their links and view performance insights.

---

## Project Goal

Deliver a production-quality, fully deployed URL Shortener with Analytics that satisfies all mandatory requirements, includes high-impact bonus features, and can be confidently explained during the final interview round.

---

## Target Users

- Developers who want to share clean short links
- Marketers who want to track link performance
- Anyone who needs to shorten and monitor URLs

---

## Core Problems This App Solves

- Long URLs are hard to share — this app shortens them instantly
- No way to know if someone clicked your link — this app tracks every click
- No central place to manage all your short links — this app provides a personal dashboard

---

## Feature Plan

### Mandatory Features

| Feature | Description |
|---|---|
| User Signup | Register with email and password |
| User Login | Authenticate and receive JWT token |
| Protected Dashboard | Only accessible when logged in |
| URL Shortening | Submit long URL, get unique short URL |
| URL Validation | Reject invalid URLs before saving |
| Unique Short Code | Generated using Base62 encoding via nanoid |
| Server-side Redirect | GET /:shortCode → 302 redirect to original URL |
| Dashboard — List URLs | Show all URLs created by logged-in user |
| Dashboard — Click Count | Show total clicks per URL |
| Dashboard — Created Date | Show when URL was created |
| Copy Short URL | One-click copy from dashboard |
| Delete URL | Remove a URL and its analytics data |
| Analytics Page | Per-URL analytics detail view |
| Total Click Count | Count of all visits to a short URL |
| Last Visited Time | Timestamp of most recent visit |
| Recent Visit History | Last 10 visits with timestamp |

### Bonus Features (Priority Order)

| Feature | Description |
|---|---|
| Custom Alias | User can define their own short code |
| QR Code Generation | Auto-generate QR code for every short URL |
| Device Analytics | Track browser and device type per visit |
| Daily Click Chart | Bar chart showing clicks per day (Recharts) |

---

## Database Plan

### Tables

- **users** — stores registered user accounts
- **urls** — stores each shortened URL with its short code and metadata
- **visits** — stores every click/visit event for analytics

### Relationships

- One user → many URLs
- One URL → many visits

---

## Architecture Plan

- **Frontend** — React + Vite + Tailwind CSS → deployed on Vercel
- **Backend** — Node.js + Express.js → deployed on Render
- **Database** — Supabase PostgreSQL accessed via Prisma ORM
- **Auth** — JWT (access token) + bcryptjs (password hashing)
- **Redirect** — Server-side 302 redirect handled by Express

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | Supabase (PostgreSQL) |
|| Cache  | Upstash Redis |
| ORM | Prisma |
| Auth | JWT + bcryptjs |
| QR Code | qrcode.react |
| Charts | Recharts |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |
| DB Host | Supabase |

---

## Project Timeline

| Phase | Task | Time |
|---|---|---|
| Phase 1 | Planning + Docs + Folder Structure | June 2 Evening |
| Phase 2 | Backend — Auth APIs | June 2 Night |
| Phase 3 | Backend — URL + Redirect + Analytics APIs | June 3 Morning |
| Phase 4 | Frontend — Auth Pages + Dashboard | June 3 Afternoon |
| Phase 5 | Frontend — Analytics Page + Bonus Features | June 3 Evening |
| Phase 6 | Deployment — Render + Vercel + Supabase | June 3 Evening |
| Phase 7 | README + Video + GitHub Push + Submit | June 3 Night (before 10 PM) |

---

## Assumptions

- Each user manages only their own URLs — no shared URLs between users
- Short codes are 7 characters, Base62 encoded using nanoid
- Analytics are stored per visit — not aggregated
- Redirect uses HTTP 302 (temporary redirect) so clicks are always tracked
- No email verification required for signup
- JWT expiry is set to 7 days
- Passwords are hashed using bcryptjs with salt rounds of 10
- Environment variables are used for all secrets and config values

---

*This project is a part of a hackathon run by https://katomaran.com*