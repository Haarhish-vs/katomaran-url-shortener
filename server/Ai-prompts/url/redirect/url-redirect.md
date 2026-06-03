ROLE

Act as a Senior Backend Engineer implementing the URL Redirection feature for a production-ready URL Shortener application.

PROJECT

Katomaran URL Shortener

TECH STACK

- Node.js
- Express
- Prisma ORM
- PostgreSQL (Supabase)

REFERENCE DOCUMENTS

1. docs/03_Architecture.md
2. docs/diagrams/05_Redirect_Flow.png

IMPORTANT

The Redirect Flow Diagram is the source of truth.

Follow every step exactly as defined in:

docs/diagrams/06_Redirect_Flow.png

Do not add additional business logic.

Do not remove any step.

CURRENT STATUS

Completed:

- Server setup
- Prisma setup
- Supabase integration
- Database migration
- Authentication module
- Create URL feature

PROJECT STRUCTURE

src/
├── url/
│ ├── url.routes.js
│ ├── url.controller.js
│ └── url.service.js
│
├── analytics/
│ ├── analytics.service.js
│
├── config/
│ └── db.js

TASK

Implement URL Redirection.

FLOW REQUIREMENTS

Follow this exact lifecycle:

Browser Request
→ Short Code Extraction
→ Route Handling
→ Database Lookup
→ Original URL Retrieval
→ Visit Recording
→ Redirect Response

CONTROLLER RESPONSIBILITIES

- Receive shortCode parameter
- Call service
- Return redirect response

SERVICE RESPONSIBILITIES

- Find URL by shortCode
- Validate URL existence
- Retrieve original URL
- Record visit analytics
- Return redirect destination

DATABASE RESPONSIBILITIES

- Find matching shortCode
- Retrieve original URL
- Create visit record

ANALYTICS REQUIREMENTS

Every successful redirect must:

- Create a Visit record
- Store timestamp
- Associate visit with URL

ERROR HANDLING

Handle:

- Invalid shortCode
- Non-existing shortCode
- Database failures

HTTP RESPONSE REQUIREMENTS

Success:

302 Redirect

Failure:

404 Not Found

CODE QUALITY REQUIREMENTS

- No dead code
- No unused imports
- No placeholder code
- No duplicate logic
- No unnecessary abstractions
- Production-ready implementation only

OUTPUT FORMAT

1. Files To Modify
2. Responsibility Of Each File
3. Complete Production-Ready Code
4. Postman Testing Steps

Generate only Redirect URL related code.

Do not modify Authentication or Create URL modules.