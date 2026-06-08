# Katomaran URL Shortener

A production-ready, feature-rich URL shortening and SaaS-grade analytics platform. It enables users to securely shorten links, schedule active durations, restrict access with passwords, generate dynamic QR codes, and trace detailed visitor demographics (country, device, browser, operating system) through offline geolocations and fallback GPS lookups.

---

## 2. Project Overview

### Problem Statement
Standard URL shorteners are often limited to simple redirection, offering little visibility into visitor demographics. Businesses and marketers need to understand their audience's geographic and technical makeup without introducing slow redirection latency, external API dependencies, or complex cookie configurations that violate privacy standards.

### Solution
Katomaran URL Shortener is a lightweight link manager built with React, Node.js, Express, and Prisma. It resolves redirection fast by parsing client user-agents and using offline synchronous IP geolocation. For higher accuracy, it incorporates a fallback browser-side GPS permission prompt that updates location metrics dynamically.

### Main Goals
- Achieve fast HTTP redirection to minimize drop-off rates.
- Classify device type, operating system, and web browser accurately.
- Secure restricted links using bcrypt password gates.
- Support link scheduling (start/expires dates) and dynamic QR codes.
- Provide a responsive SaaS dashboard with global and single-link analytics.

---

## 3. Features

### Authentication & Authorization
- **Secure Registration & Login**: Validated email and password submission.
- **JWT Authorization**: Token stored locally in the frontend client and sent securely via headers to authenticate all analytics and link-management endpoints.

### Link Management
- **URL Shortening**: Generates a standard short code or matches a custom alias.
- **Custom Alias**: Validates uniqueness against the database to protect existing links.
- **Duration Scheduling**: Start date activation and expiry limits with automated redirection blocks.
- **Password Protection**: Gated access page validating input using bcrypt hashes before logging metrics and performing redirect.
- **QR Code Generation**: Instantly renders custom high-quality QR codes for all short links in the UI.

### SaaS Analytics Dashboard
- **Timeline Analytics**: Displays daily click trends in interactive charts using Recharts.
- **Device & Browser breakdown**: Renders HSL-styled progress cards mapping desktop/mobile/tablet ratios and browser names.
- **Geographic Country analytics**: Renders a list of top visiting countries utilizing clean country name mappings.
- **Recent Visit History**: Displays cross-URL (global) or single-URL real-time visitor records.

---

## 4. Tech Stack

- **Frontend**: React (v19), React Router DOM (v7), Vite, TailwindCSS (v4), Recharts (v3), Axios
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL (Prisma adapter)
- **Authentication**: JWT, bcrypt password hashing
- **Deployment**: Vercel (Frontend), Render (Backend / Database)
- **Libraries**: `geoip-lite` (Offline IP Geolocation), `qrcode` (QR code generation)

---

## 5. Architecture Overview

```
User
  ↓ (Interacts with frontend dashboards, logs in, manages links)
Frontend (React client)
  ↓ (Sends REST API requests with JWT headers or redirects visitor links)
Backend (Express server)
  ↓ (Validates parameters, parses user-agent metadata, runs offline lookup)
Database (PostgreSQL via Prisma ORM)
```

---

## 6. Architecture Diagram

```mermaid
graph TD
    User([User / Visitor]) -->|Browses Dashboard| FE[Frontend Client - React]
    User -->|Accesses Short Link| BE[Backend Server - Express]
    FE -->|API Requests with JWT| BE
    BE -->|Query / Mutate| DB[(PostgreSQL Database)]
    BE -->|Lookup IP Geolocation| GI[geoip-lite Offline Library]
    BE -->|Classify Browser/OS| UA[Regex UA Parsing]
```

---

## 7. Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Client as Frontend Client
    participant Server as Backend Server
    participant DB as PostgreSQL Database

    User->>Client: Enters credentials (Login/Signup)
    Client->>Server: POST /api/auth/login (email, password)
    Server->>DB: Fetch user by email
    DB-->>Server: User record (passwordHash)
    Server->>Server: Verify bcrypt password hash
    Server-->>Client: Returns JWT Token
    Client->>Client: Stores JWT in localStorage
```

---

## 8. URL Creation Flow

```mermaid
graph TD
    A[Long URL Input] --> B{Validation}
    B -->|Invalid| C[Return Error]
    B -->|Valid| D{Custom Alias?}
    D -->|Yes| E{Is Unique?}
    E -->|No| C
    E -->|Yes| F[Assign Alias]
    D -->|No| G[Generate Short Code]
    F & G --> H{Password Protected?}
    H -->|Yes| I[Hash Password with bcrypt]
    H -->|No| J{Start & Expiry Dates?}
    I --> J
    J -->|Yes| K[Save Start/Expiry constraints]
    J -->|No| L[Store URL in DB]
    K --> L
    L --> M[Generate dynamic QR Code & Short Link]
```

---

## 9. Analytics Flow

```mermaid
sequenceDiagram
    actor Visitor
    participant Server as Backend Server
    participant DB as PostgreSQL Database
    participant Client as Frontend Client

    Visitor->>Server: GET /:shortCode
    Server->>Server: Parse UA (Device, OS, Browser)
    Server->>Server: Run geoip-lite lookup on client IP
    Server->>DB: create Visit record (ip, ua, country, device)
    Server-->>Visitor: Serve HTML Redirect Page
    Note over Visitor,Server: Fallback Browser GPS Location
    Visitor->>Server: PATCH /api/analytics/visit/:visitId/location (GPS Country, City)
    Server->>DB: Update Location details
    Visitor->>Visitor: Window Redirect to original URL
    Client->>Server: GET /api/analytics/:shortCode (Headers: JWT)
    Server->>DB: Aggregates metrics (GroupBy device, browser, country)
    DB-->>Server: Return Grouped records
    Server-->>Client: Return JSON payload
    Client->>Client: Update dashboard charts
```

---

## 10. Database Design

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  urls         Url[]
  createdAt    DateTime @default(now())
}

model Url {
  id                  String    @id @default(cuid())
  originalUrl         String
  shortCode           String?   @unique
  userId              String
  user                User      @relation(fields: [userId], references: [id])
  visits              Visit[]
  startDate           DateTime?
  expiresAt           DateTime?
  isPasswordProtected Boolean   @default(false)
  passwordHash        String?
  createdAt           DateTime  @default(now())
}

model Visit {
  id              String   @id @default(cuid())
  urlId           String
  url             Url      @relation(fields: [urlId], references: [id])
  clickedAt       DateTime @default(now())
  deviceType      String?  @default("Unknown")
  browser         String?  @default("Unknown")
  operatingSystem String?  @default("Unknown")
  country         String?
  region          String?
  city            String?
  ipAddress       String?
  referrer        String?
}
```

---

## 11. API Overview

### Authentication
- `POST /api/auth/signup`: Registers a new user. Returns JWT token.
- `POST /api/auth/login`: Authenticates email and password. Returns JWT token.

### URL Management
- `POST /api/urls`: Creates a new short link (supports custom alias, password, start/expiry dates).
- `GET /api/urls`: Retrieves all links created by the authenticated user.
- `DELETE /api/urls/:id`: Deletes a link and its associated analytics history.
- `POST /api/urls/verify-password`: Unlocks a password-protected short link.

### Analytics
- `GET /api/analytics/user`: Aggregated metrics for all links belonging to the user.
- `GET /api/analytics/summary`: Account-wide summary counts (Total clicks, total links, last visit).
- `GET /api/analytics/:shortCode`: Detailed device, browser, location, and trend metrics for a specific link.
- `PATCH /api/analytics/visit/:visitId/location`: Accepts browser-provided GPS coordinates (country, city) to refine visit geolocation.

### Redirects
- `GET /:shortCode`: Server-side endpoint mapping visitors to their destination. Logs User-Agent, Referrer, and IP address.

---

## 12. Folder Structure

```
katomaran-url-shortener/
├── client/                     # Frontend Application
│   └── client/
│       ├── dist/               # Compiled production assets
│       ├── src/
│       │   ├── components/     # UI components (Navbar, analytics charts)
│       │   ├── context/        # Auth state management
│       │   ├── pages/          # Page layouts (Dashboard, Analytics, gates)
│       │   └── services/       # Axios API client modules
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
├── server/                     # Backend API Service
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma       # Database design schema
│   ├── src/
│   │   ├── analytics/          # Services, controllers, routing for analytics
│   │   ├── auth/               # User authentication handlers
│   │   ├── config/             # Database and environment configurations
│   │   ├── middleware/         # Auth validation, error handlers
│   │   ├── url/                # Redirection, password checks, link generation
│   │   └── server.js           # Server initializer
│   ├── package.json
└── README.md
├── vercel.json                 # Vercel Serverless configuration
```

---

## 13. Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL Database

### Database Setup
1. In the `server` directory, configure your database URL in a `.env` file:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/dbname?schema=public"
   ```
2. Run database migrations:
   ```bash
   npx prisma db push
   ```

### Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start in development mode:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client folder:
   ```bash
   cd client/client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_BASE_URL="http://localhost:5000/api"
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

---

## 14. Environment Variables

### Backend (`server/.env`)
- `PORT`: Server port (defaults to `5000`).
- `DATABASE_URL`: Connection string for PostgreSQL database.
- `JWT_SECRET`: Secret key for signing JWT authorization tokens.
- `FRONTEND_URL`: URL of the frontend application (for CORS whitelist).
- `BASE_URL`: Base URL used for constructing shortened links.

### Frontend (`client/client/.env`)
- `VITE_API_BASE_URL`: REST API endpoint prefix (e.g., `http://localhost:5000/api`).

---

## 15. Assumptions Made

- **Local Geolocation Fallback**: For loopback IPs (`::1` or `127.0.0.1`), geolocation resolves to a mock public IP (`103.208.69.1` - Pune, India) during local development to enable easy geographic testing.
- **Windows Emoji Display**: Windows OS does not natively support flag emojis. Therefore, the system automatically translates country codes (e.g., `IN`, `US`) to full names (e.g., `India`, `United States`) to avoid displaying duplicate codes like `IN IN`.
- **Latency Optimization**: Geolocation lookups on the server are executed synchronously using the local `geoip-lite` database, removing network API delays and rate limits on HTTP redirects.

---

## 16. Deployment Guide

### Database
- Hosted on PostgreSQL services (e.g. Supabase, Render, Neon).
- Copy the connection strings and input them into backend environment variables.

### Backend (Render)
- Deploy using Node.js runtime.
- Build command: `npm run build` (runs `prisma generate`).
- Start command: `npm run start` (runs `node src/server.js`).

### Frontend (Vercel)
- Deploy using the static site presets (Vite build folder `dist`).
- Environment variables: `VITE_API_BASE_URL` mapped to the backend production URL.

---

## 17. Testing Guide

### Authentication
- Register a user on the signup page. Verify that a unique token is stored in `localStorage` under `token`.
- Log out, confirm the dashboard is blocked, and test logging back in.

### Link Customization & Expiry
- Create a link with a start date in the future and verify redirection fails with an inactive message.
- Create a link with a past expiration date and verify it displays an expired code response.
- Create a link with password protection, navigate to the short URL, input the password, and verify it successfully routes.

### Analytics Verification
- Visit a short URL from multiple devices.
- Verify the global dashboard updates device, browser, and location metrics.
- Navigate to the specific link analytics dashboard and verify the corresponding graphs and visitor list.

---

## 18. AI Planning & Development Process

The project followed a multi-phase AI-assisted implementation plan:
- **Database Schema Planning**: Outlined the `Visit` schema to capture browser parsing details and location strings without creating large join tables.
- **Security Analysis**: Constructed gated password check handlers which verify bcrypt entries inside the REST flow before executing analytical increments.
- **Offline Classification**: Configured synchronous user-agent parsing and local databases to keep redirects fast and rate-limit proof.
- **Responsive Dashboard Assembly**: Implemented interactive UI components, integrating reusable breakdown metric charts for both individual links and workspace analytics.

---
## 19. Demo Video

A complete walkthrough of the Katomaran URL Shortener, including authentication, URL management, analytics, QR code generation, and deployment, can be viewed below:

**Demo Video:** https://youtu.be/H-UFbi1VIQQ


---

This project is a part of a hackathon run by https://katomaran.com
