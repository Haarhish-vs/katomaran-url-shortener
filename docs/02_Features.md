# 02 — Features Documentation

## Mandatory Features

### 1. Authentication

#### User Signup
- User enters email and password
- Password is hashed using bcryptjs (salt rounds: 10)
- User record is saved to the users table in Supabase PostgreSQL
- JWT token is returned on successful signup
- Duplicate email returns a 409 Conflict error

#### User Login
- User enters email and password
- Password is compared against stored hash using bcrypt.compare()
- JWT token is returned on successful login
- Wrong credentials return a 401 Unauthorized error

#### JWT Protected Routes
- All dashboard and URL routes require a valid JWT
- Token is sent in the Authorization header as Bearer token
- Middleware verifies token on every protected request
- Expired or invalid token returns 401 Unauthorized

#### User Ownership
- Every URL is linked to the user who created it via user_id
- Users can only view, edit, and delete their own URLs
- No cross-user data access is possible

---

### 2. URL Shortening

#### Submit Long URL
- User submits a long URL from the dashboard form
- Backend validates the URL format before saving
- Invalid URLs are rejected with a 400 Bad Request error

#### URL Validation
- Validation checks that the input is a properly formatted URL
- Uses Node.js built-in URL constructor for validation
- Both http:// and https:// URLs are accepted

#### Unique Short Code Generation
- Short code is 7 characters long
- Generated using nanoid (Base62: a-z, A-Z, 0-9)
- Uniqueness is enforced by a UNIQUE constraint on the short_code column
- If collision occurs, a new code is regenerated automatically

#### Short URL Format
- Format: https://your-backend-url.onrender.com/:shortCode
- Example: https://your-backend-url.onrender.com/aB3xY9z

#### Server-Side Redirect with Redis Caching
- GET /:shortCode hits the Express backend
- Backend checks Redis cache first using shortCode as the key
- Cache HIT → redirect instantly without any database query (fast path)
- Cache MISS → query Supabase PostgreSQL for the original URL
- Found in DB → store in Redis with TTL of 24 hours → redirect
- If not found → returns 404 Not Found
- If expired → returns 410 Gone
- On every redirect → visit record is saved to visits table for analytics

---

### 3. Redis Caching

#### Why Redis
- Redirect is the most frequently called endpoint in a URL shortener
- Without cache, every click hits the database — slow and expensive
- Redis stores shortCode → originalUrl in memory for ultra-fast lookup
- Reduces database load significantly on high traffic short URLs

#### Cache Strategy — Cache Aside Pattern
- Application checks cache before database on every redirect request
- On cache miss, result is fetched from DB and stored in Redis
- Cache is never written directly — only populated on miss

#### Cache Key and Value
- Key: shortCode (example: aB3xY9z)
- Value: originalUrl (example: https://www.google.com)

#### TTL (Time To Live)
- Default TTL: 86400 seconds (24 hours)
- If URL has a custom expiry date set by user → TTL matches that expiry
- After TTL expires, Redis automatically removes the key

#### Cache Invalidation
- When a user deletes a URL → redis.del(shortCode) is called immediately
- Prevents stale cache from redirecting to a deleted URL
- Ensures data consistency between Redis and PostgreSQL at all times

#### Redis Provider
- Upstash Redis (serverless, free tier, no Redis server needed)
- Works seamlessly with Render deployment
- Configured via UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN env variables

---

### 4. User Dashboard

#### View All URLs
- Dashboard fetches all URLs belonging to the logged-in user
- Displayed as a clean card list sorted by created date (newest first)

#### Each URL Card Shows
- Original URL (truncated with tooltip for full URL)
- Short URL (full clickable link)
- Created date (formatted as readable date)
- Total click count (live from database)

#### Copy Short URL
- One-click copy button on every URL card
- Uses navigator.clipboard.writeText() browser API
- Shows a success toast notification after copying

#### Delete URL
- Delete button on every URL card
- Sends DELETE request to backend
- Removes URL and all associated visit records from PostgreSQL
- Removes shortCode from Redis cache immediately
- Card is removed from UI immediately after deletion

---

### 5. Analytics

#### Click Tracking
- Every time a short URL is visited, a visit record is saved
- Visit record stores: url_id, visited_at timestamp, browser, device

#### Analytics Page (per URL)
- Accessible from each URL card on the dashboard
- Shows detailed analytics for that specific URL

#### Analytics Data Displayed
- Total click count (count of all visits)
- Last visited time (most recent visit timestamp)
- Recent visit history (last 10 visits as a table)
- Daily click trend chart (bar chart — clicks grouped by day)
- Device and browser breakdown table

---

### 6. UI Requirements

#### Responsive Design
- Works on mobile, tablet, and desktop
- Tailwind CSS breakpoints used: sm, md, lg

#### Loading States
- Spinner shown while API calls are in progress
- Buttons are disabled during loading to prevent double submissions

#### Success States
- Toast notification on: URL created, URL copied, URL deleted
- Green success messages where applicable

#### Error States
- Red error messages for: invalid URL, wrong login, server errors
- Form validation messages shown inline below each input

#### Form Validation
- Email format validation on signup and login
- URL format validation on shorten form
- Empty field validation on all forms

---

## Bonus Features

### 1. Custom Alias
- User can optionally enter a custom short code instead of auto-generated one
- Backend checks if alias is already taken (409 Conflict if taken)
- Alias is used as the short_code in the database
- Only alphanumeric characters and hyphens allowed

### 2. QR Code Generation
- Every URL card has a QR Code button
- Clicking opens a modal showing the QR code for that short URL
- Built using qrcode.react library
- QR code can be downloaded as PNG

### 3. Device Analytics
- Every visit records browser name and device type
- Extracted from the User-Agent header using ua-parser-js
- Shown in the analytics page as a breakdown table

### 4. Daily Click Chart
- Bar chart on the analytics page
- X-axis: date, Y-axis: number of clicks
- Data is grouped by day using SQL query on the visits table
- Built using Recharts BarChart component

---

## Features NOT Implemented (and Why)

| Feature | Reason Skipped |
|---|---|
| CSV Bulk Upload | Time constraint — prioritized core features |
| Public Stats Page | Not required for evaluation criteria |
| Geo Analytics | Requires paid IP geolocation API |
| Edit Destination URL | Skipped to focus on bonus features with more impact |

---

## Future Scope

- Redis cache warming on server startup for most clicked URLs
- Password reset via email using nodemailer
- Link preview with Open Graph metadata
- Team and organization shared links
- API rate limiting per user using Redis counter
- Custom domain support for short URLs

---

*This project is a part of a hackathon run by https://katomaran.com*