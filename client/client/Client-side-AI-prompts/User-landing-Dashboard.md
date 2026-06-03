ROLE

Act as a Senior Frontend Engineer and Senior UI/UX Designer.

PROJECT

Katomaran URL Shortener

TECH STACK

- React
- React Router
- Tailwind CSS
- Axios

REFERENCE DOCUMENTS

1. docs/architecture/02_Architecture.md
2. docs/diagrams/05_Create_URL_Flow.png
3. docs/diagrams/06_Redirect_Flow.png
4. docs/diagrams/07_Analytics_Flow.png

IMPORTANT

Before generating code:

1. Analyze all referenced flow diagrams.
2. Analyze backend API responsibilities.
3. Analyze user experience requirements.
4. Map frontend UI to backend APIs.
5. Explain component responsibility mapping.
6. Then generate code.

DASHBOARD UX REQUIREMENTS

The Dashboard is the default landing page.

Users can access and view the Dashboard UI without authentication.

Users can see:

- Hero section
- URL input section
- Statistics cards
- URL management area
- Analytics preview cards

However:

Unauthenticated users CANNOT:

- Create URLs
- View personal analytics
- Delete URLs
- Access user-specific data

When an unauthenticated user attempts a protected action:

DO NOT redirect immediately.

Instead:

Display a professional toast notification.

Example:

"Please sign in to continue."

or

"Create an account to start shortening URLs."

Then provide:

Login Button
Signup Button

UI/UX REQUIREMENTS

Design Style:

- Modern SaaS Design
- Dark Theme
- Professional Dashboard
- Card Based Layout
- Clean Typography
- Consistent Spacing
- Mobile First
- Fully Responsive

Must support:

- Mobile
- Tablet
- Laptop
- Desktop

No horizontal scrolling.

No unnecessary animations.

LAYOUT STRUCTURE

Navbar

- Logo
- Login
- Signup

Hero Section

- Product headline
- Product description

Create URL Section

- URL Input
- Shorten Button

Statistics Section

- Total URLs
- Total Clicks
- Analytics Summary

URL Management Section

- URL Table Placeholder

Analytics Preview Section

- Analytics Cards Placeholder

BACKEND MAPPING

Create URL

POST /api/urls

Server Files:

src/url/url.routes.js
src/url/url.controller.js
src/url/url.service.js

Analytics

GET /api/analytics/:urlId

Server Files:

src/analytics/analytics.routes.js
src/analytics/analytics.controller.js
src/analytics/analytics.service.js

Delete URL

DELETE /api/urls/:id

Server Files:

src/url/url.routes.js
src/url/url.controller.js
src/url/url.service.js

AUTHENTICATION BEHAVIOR

Authenticated User

- Full functionality available

Unauthenticated User

- Read-only experience
- Protected actions trigger login/signup prompt

CODE QUALITY REQUIREMENTS

- No dead code
- No unused imports
- No placeholder business logic
- Responsive design only
- Production-ready component structure

OUTPUT FORMAT

1. Diagram Analysis
2. Backend Mapping
3. Component Structure
4. Responsive Design Strategy
5. Complete Code

Generate only Dashboard-related frontend code.
Do not generate Login or Signup pages.