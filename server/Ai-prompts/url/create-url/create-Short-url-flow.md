ROLE

Act as a Senior Backend Engineer implementing the core URL Shortener feature.

PROJECT

Katomaran URL Shortener

TECH STACK

- Node.js
- Express
- Prisma ORM
- PostgreSQL (Supabase)
- JWT Authentication

REFERENCE DOCUMENTS

1. docs/architecture/02_Architecture.md
2. docs/diagrams/05_Create_URL_Flow.png

IMPORTANT

The Create URL Flow Diagram is the source of truth.

Follow every step exactly as defined in:

docs/diagrams/05_Create_URL_Flow.png

Do not add additional business logic.

Do not remove any step.

Do not simplify the flow.

CURRENT STATUS

Completed:

- Server setup
- Prisma setup
- Supabase integration
- Database migration
- Signup flow
- Login flow
- JWT middleware

PROJECT STRUCTURE

src/
├── url/
│ ├── url.routes.js
│ ├── url.controller.js
│ └── url.service.js
│
├── middleware/
│ └── auth.middleware.js
│
├── utils/
│ └── base62.js
│
├── config/
│ └── db.js

TASK

Implement the Create URL feature.

FLOW REQUIREMENTS

Follow this exact lifecycle:

Authenticated User
→ JWT Verification
→ URL Submission
→ URL Validation
→ Database Record Creation
→ Unique ID Generation
→ Base62 Encoding
→ Short Code Generation
→ Database Update
→ Response Creation

CONTROLLER RESPONSIBILITIES

- Receive request
- Validate required input presence
- Call service
- Return response

SERVICE RESPONSIBILITIES

- Validate URL format
- Create URL record
- Generate short code
- Update database record
- Return final response

DATABASE RESPONSIBILITIES

- Create URL record
- Store original URL
- Store short code
- Associate URL with authenticated user

JWT REQUIREMENTS

- Protected route only
- User identity must come from JWT middleware
- Never accept userId from request body

CODE QUALITY REQUIREMENTS

- No dead code
- No unused imports
- No placeholder code
- No duplicate logic
- No unnecessary helper functions
- No unnecessary abstractions
- Production-ready implementation only

ERROR HANDLING

Handle:

- Missing URL
- Invalid URL format
- Unauthorized user
- Database failures

OUTPUT FORMAT

1. Files To Create
2. Files To Modify
3. Responsibility Of Each File
4. Complete Production-Ready Code
5. Postman Test Cases

Generate only Create URL related code.

Do not modify Signup, Login, JWT, Analytics, or Redirect modules.