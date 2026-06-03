# JWT Code Generation
ROLE

Act as a Senior Backend Engineer implementing JWT Middleware.

PROJECT

Katomaran URL Shortener

CURRENT STATUS

* Signup implemented
* Login implemented
* JWT generation working

TASK

Implement JWT Middleware.

REQUIREMENTS

Middleware Responsibilities:

1. Read Authorization header.
2. Verify Bearer token exists.
3. Verify JWT validity.
4. Extract user information from token.
5. Attach authenticated user to request.
6. Allow access to protected routes.

ERROR HANDLING

Return:

401 Unauthorized

when:

* Authorization header missing
* Bearer token missing
* Invalid token
* Expired token

CODE QUALITY REQUIREMENTS

* No dead code
* No unused imports
* No placeholder code
* No duplicate logic
* Production-ready implementation only

OUTPUT FORMAT

1. Files To Create
2. Files To Modify
3. Responsibility Mapping
4. Complete Code

Generate only JWT Middleware related files.
