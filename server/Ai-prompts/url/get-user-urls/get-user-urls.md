ROLE

Act as a Senior Backend Engineer implementing User URL Retrieval.

PROJECT

Katomaran URL Shortener

REFERENCE DOCUMENTS

1. docs/architecture/02_Architecture.md
2. docs/diagrams/10_End_To_End_Flow.png

IMPORTANT

Use the authenticated user from JWT middleware.

CURRENT STATUS

* JWT Middleware completed
* Create URL completed

TASK

Implement Get User URLs.

FLOW REQUIREMENTS

JWT Verification
→ Extract User ID
→ Query User URLs
→ Return URL List

REQUIREMENTS

* Protected route only
* Never accept userId from request body
* Use authenticated user from JWT
* Return only URLs belonging to the logged-in user
* No dead code
* No unused imports

OUTPUT FORMAT

1. Files To Modify
2. Responsibility Mapping
3. Complete Code
4. Postman Test Cases
