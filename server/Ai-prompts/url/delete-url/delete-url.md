ROLE

Act as a Senior Backend Engineer implementing URL Deletion.

PROJECT

Katomaran URL Shortener

REFERENCE DOCUMENTS

1. docs/architecture/02_Architecture.md
2. docs/diagrams/10_End_To_End_Flow.png

IMPORTANT

Only the URL owner can delete a URL.

CURRENT STATUS

* JWT Middleware completed
* Create URL completed
* Get User URLs completed

TASK

Implement Delete URL.

FLOW REQUIREMENTS

JWT Verification
→ URL Lookup
→ Ownership Verification
→ Delete URL
→ Success Response

REQUIREMENTS

* Protected route only
* Verify ownership before deletion
* Return 404 if URL not found
* Return 403 if ownership check fails
* No dead code
* No unused imports

OUTPUT FORMAT

1. Files To Modify
2. Responsibility Mapping
3. Complete Code
4. Postman Test Cases
