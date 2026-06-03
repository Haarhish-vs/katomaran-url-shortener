ROLE

Act as a Senior Backend Engineer performing architecture-driven implementation.

PROJECT

Katomaran URL Shortener

TECH STACK

* Node.js
* Express
* Prisma ORM
* PostgreSQL (Supabase)
* bcrypt
* JWT

REFERENCE DOCUMENTS

1. docs/03_Architecture.md
2. docs/diagrams/02_Signup_Flow.png

CURRENT STATUS

Completed:

* Server setup
* Feature-based architecture
* Supabase integration
* Prisma configuration
* Initial migration
* Database schema creation
* Prisma client generation
* Backend connectivity verification

AUTH MODULE

Current Structure:

src/
├── auth/
│   ├── auth.routes.js
│   ├── auth.controller.js
│   └── auth.service.js
│
├── config/
│   └── db.js
│
├── utils/
│   ├── jwt.js
│   └── hash.js

TASK

Implement the Signup Flow.

IMPORTANT

The Signup Flow Diagram is the source of truth.

Follow every step exactly as defined in:

docs/diagrams/02_Signup_Flow.png

Do not add additional business logic.

Do not remove any step.

Do not simplify the flow.

IMPLEMENTATION REQUIREMENTS

Map the implementation exactly to:

Route
→ Controller
→ Service
→ Prisma
→ Database

Controller Responsibilities:

* Receive request
* Validate required input presence
* Call service
* Return response

Service Responsibilities:

* Business logic
* Email existence verification
* Password hashing
* User creation
* JWT generation

Prisma Responsibilities:

* Query existing user
* Create new user

SECURITY REQUIREMENTS

* Use bcrypt salt generation
* Use bcrypt hashing
* Never store plain text passwords
* Never return password hash
* Return JWT after successful signup

CODE QUALITY REQUIREMENTS

* No dead code
* No unused imports
* No placeholder code
* No commented code
* No duplicate logic
* No unnecessary helper functions
* No unnecessary abstractions
* Production-ready implementation only

OUTPUT FORMAT

1. Files To Create
2. Files To Modify
3. Responsibility Of Each File
4. Complete Code

Generate only the files required for Signup implementation.

Do not modify unrelated modules.
