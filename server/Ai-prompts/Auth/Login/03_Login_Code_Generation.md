ROLE

Act as a Senior Backend Engineer performing architecture-driven implementation.

REFERENCE DOCUMENT

docs/diagrams/03_Login_Flow.png

IMPORTANT

The Login Flow Diagram is the source of truth.

Follow every step exactly as defined in the diagram.

Do not add extra business logic.

Do not skip any step.

CURRENT PROJECT STATUS

- Signup implemented and tested
- JWT generation already exists
- Prisma configured
- PostgreSQL connected

TASK

Implement Login.

IMPLEMENTATION REQUIREMENTS

Route
→ Controller
→ Service
→ Prisma
→ Database

Controller Responsibilities

- Receive request
- Validate required input
- Call service
- Return response

Service Responsibilities

- Find user by email
- Verify user existence
- Compare password using bcrypt.compare()
- Generate JWT
- Return login result

SECURITY REQUIREMENTS

- Never return passwordHash
- Return 404 if user not found
- Return 401 for invalid password
- Return JWT only after successful authentication

CODE QUALITY REQUIREMENTS

- No dead code
- No unused imports
- No placeholder code
- No commented code
- No duplicate logic
- No unnecessary helper functions
- No unnecessary abstractions
- Production-ready implementation only

OUTPUT FORMAT

1. Files To Modify
2. Responsibility Of Each File
3. Complete Code

Generate only the files required for Login implementation.
Do not modify unrelated modules.