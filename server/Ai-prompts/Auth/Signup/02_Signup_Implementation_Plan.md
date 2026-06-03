Act as a Senior Backend Engineer.

Project:
URL Shortener

Stack:

* Node.js
* Express
* Prisma ORM
* PostgreSQL (Supabase)
* bcrypt
* JWT

Reference Documents:

1. docs/03_Architecture.md
2. docs/diagrams/02_Signup_Flow.png

Current Backend Structure:

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

Current Status:

* Supabase connected
* Prisma configured
* Migration completed
* User table created
* Backend server running

Task:

Create a detailed Signup implementation plan.

Requirements:

Follow the exact Signup Flow Diagram.

For every step in the diagram:

1. Explain what happens.
2. Identify the responsible file.
3. Identify the responsible function.
4. Explain the database operation.
5. Explain the security operation.
6. Explain request and response data.

Output Format:

1. Signup Request Flow
2. Route Responsibilities
3. Controller Responsibilities
4. Service Responsibilities
5. Prisma Operations
6. bcrypt Operations
7. JWT Operations
8. Status Codes
9. Error Cases
10. Postman Test Cases
11. Development Checklist

Do not generate code.

Generate only the implementation plan.
