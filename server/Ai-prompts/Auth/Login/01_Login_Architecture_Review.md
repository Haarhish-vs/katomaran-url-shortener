1. Architecture Review

The login flow is a credential-verification pipeline that begins in the browser, moves through HTTPS transport, and ends with the client storing a JWT and redirecting the authenticated user to the dashboard. The diagram defines the complete lifecycle and should be treated as the source of truth for both backend behavior and frontend expectations.

The core backend responsibility is to:

1. Receive the login request at `POST /api/auth/login`.
2. Validate the payload before any database access.
3. Look up the user by email.
4. Compare the submitted password against the stored hash with `bcrypt.compare`.
5. Issue a JWT only after authentication succeeds.
6. Return a clean success response for the client to store and use.

The client responsibility is to:

1. Collect email and password.
2. Validate required fields and email format before sending the request.
3. Submit the request over HTTPS.
4. Store the returned JWT.
5. Redirect the user to the dashboard.

6. Request Flow

The request flow follows the diagram step by step:

1. The user clicks Login and enters email plus password.
2. Frontend validation checks that the email is present, correctly formatted, and that the password is not empty.
3. If validation fails, the client shows a validation error immediately and does not call the server.
4. If validation passes, the client sends `POST /api/auth/login` with `{ email, password }`.
5. The request travels over HTTPS with TLS encryption.
6. Express receives the request in the backend.
7. The route matcher resolves `router.post('/login', loginController)`.
8. The login controller receives the request body.
9. The controller performs backend validation for missing or invalid data.
10. If email or password is missing, the server returns `400 Bad Request`.
11. If the payload is valid, the service queries Prisma for the user by email.
12. If no user is found, the server returns `401 Unauthorized`.
13. If a user exists, the service verifies the password with `bcrypt.compare(password, storedHash)`.
14. If the password does not match, the server returns `401 Unauthorized`.
15. If the password matches, the service generates a JWT with the user identifier in the payload.
16. The server returns `200 OK` with a success message and token.
17. The frontend receives the response and stores the JWT in client storage.
18. The frontend redirects the user to `/dashboard`.
19. The dashboard opens only after the client has an authenticated token.

20. Database Flow

The database is involved only after the server confirms the request contains valid login data.

1. The backend queries the `users` table through Prisma using `findUnique({ where: { email } })`.
2. The lookup is read-only; login does not modify the database.
3. The database returns the matching user record if the email exists.
4. The service reads the stored password hash from the database record.
5. The service never compares the plaintext password directly against the database.
6. If the email is missing from the database, authentication stops immediately.
7. If the email exists, the server continues to password verification.

The important database rule is that login must not create, update, or delete any row. It is a read-and-verify operation only.

4. Security Flow

The login flow relies on layered security checks.

1. HTTPS protects the credentials in transit with TLS encryption.
2. Frontend validation reduces unnecessary requests and improves UX, but it is not a security boundary.
3. Backend validation is mandatory and enforces required fields on the server side.
4. Email lookup happens before password comparison so the server can determine whether the account exists.
5. Password verification uses `bcrypt.compare`, which checks the submitted password against the stored hash without exposing the original password.
6. The JWT is generated only after successful password verification.
7. The token payload should contain only the minimum identity data needed, such as `userId`.
8. The client stores the JWT for subsequent authenticated requests.
9. Protected dashboard access depends on token presence and later authorization checks.

Security boundaries to preserve:

1. Never log plaintext passwords.
2. Never return the stored password hash in any response.
3. Never generate a JWT before the password match succeeds.
4. Never let frontend validation replace backend validation.

5. File Responsibility Mapping

`src/auth/auth.routes.js`

1. Exposes the `/login` route.
2. Maps `POST /login` to the login controller.
3. Keeps request routing separate from business logic.

`src/auth/auth.controller.js`

1. Receives the login request body.
2. Validates missing or invalid input.
3. Returns `400` for invalid payloads.
4. Calls the service layer for authentication work.
5. Converts service results into HTTP responses.

`src/auth/auth.service.js`

1. Looks up the user by email through Prisma.
2. Handles the `findUnique` database query.
3. Verifies the password hash with `bcrypt.compare`.
4. Generates the JWT after successful authentication.
5. Returns the authenticated user data and token to the controller.

`src/config/db.js`

1. Provides the Prisma client used by the service.
2. Centralizes database connectivity.

`src/utils/jwt.js`

1. Encapsulates JWT signing.
2. Keeps token creation logic reusable and centralized.

3. Status Codes

`200 OK`

1. Returned when the email exists and the password matches.
2. Indicates login success and token issuance.

`400 Bad Request`

1. Returned when email or password is missing.
2. Returned when the request body is malformed or invalid.

`401 Unauthorized`

1. Returned when the user does not exist.
2. Returned when the password does not match the stored hash.

`500 Internal Server Error`

1. Returned for unexpected server failures.
2. Covers database outages, token generation failures, or other unhandled exceptions.

3. Edge Cases

4. Empty email input should fail at the frontend and backend.
5. Empty password input should fail at the frontend and backend.
6. Invalid email formatting should return a validation error.
7. Nonexistent users should return `401 Unauthorized` without revealing whether the email is registered.
8. Wrong passwords should return `401 Unauthorized` with a generic invalid credentials message.
9. Database errors should not leak internal details to the client.
10. JWT generation failure should be treated as a server error.
11. Client-side token storage failure should prevent dashboard access until resolved.

12. Implementation Roadmap

13. Confirm the login route is mounted at `/api/auth/login`.
14. Keep backend validation in the controller for empty or malformed input.
15. Query the user by email using Prisma.
16. Compare passwords with `bcrypt.compare` only after a user is found.
17. Generate a JWT only after a successful password match.
18. Return a consistent success response containing the token.
19. Ensure the frontend stores the token and redirects to the dashboard.
20. Verify all failure paths return the correct status codes.
21. Keep the login flow aligned with the diagram and avoid adding extra steps.
