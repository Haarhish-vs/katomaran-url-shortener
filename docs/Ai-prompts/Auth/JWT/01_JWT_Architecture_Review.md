# JWT Architecture Review

1. Architecture Review

The JWT middleware layer is the gatekeeper for protected routes. Its job is to stop unauthenticated requests before they reach route handlers, verify that the provided token is valid, and attach the authenticated identity to the request so downstream handlers can trust it.

In this project, the token is created during login and then sent by the client on every protected request using the `Authorization` header. The middleware must treat the token as the source of truth for identity after login, but it must still verify every request independently.

The architecture is intentionally narrow:

1. The client includes a Bearer token in the request header.
2. The middleware extracts the token from the header.
3. The middleware verifies the token signature and expiry.
4. The decoded token payload is attached to the request object.
5. The request continues only if authentication succeeds.

2. Request Flow

The protected-route request lifecycle is:

1. The client sends a request to a protected endpoint.
2. The request includes `Authorization: Bearer <token>`.
3. Express receives the request and passes it through the middleware chain.
4. The JWT middleware checks whether the `Authorization` header exists.
5. If the header is missing, the middleware stops the request.
6. The middleware confirms the header uses the `Bearer` scheme.
7. The middleware extracts the raw token portion from the header.
8. The middleware verifies the token using the shared JWT secret.
9. If verification succeeds, the decoded payload is attached to the request.
10. The middleware calls `next()` and the protected controller executes.
11. If verification fails, the request ends immediately with an authentication error.

3. Security Flow

The JWT middleware is a security boundary, not a convenience helper.

1. It prevents unauthenticated access to protected routes.
2. It rejects requests without a token before they reach business logic.
3. It rejects malformed authorization headers.
4. It rejects expired tokens.
5. It rejects tokens with invalid signatures.
6. It prevents clients from forging identity by supplying arbitrary payloads.
7. It ensures every protected request is revalidated independently.
8. It should never trust a token without verification.

Security rules to preserve:

1. Never accept tokens from request bodies or query strings for protected routes.
2. Never expose the JWT secret.
3. Never decode a token and trust it without signature verification.
4. Never store the password or password hash in the token payload.
5. Keep the payload minimal, usually only the user identifier and email.

4. Error Flow

The middleware should fail fast and return consistent errors.

1. Missing `Authorization` header returns `401 Unauthorized`.
2. Header values that do not follow `Bearer <token>` return `401 Unauthorized`.
3. Empty token values return `401 Unauthorized`.
4. Invalid or expired tokens return `401 Unauthorized`.
5. Unexpected verification failures return `500 Internal Server Error` only if they are not authentication failures.

Error responses should be generic and avoid leaking whether the token was structurally valid, expired, or tampered with.

5. Middleware Responsibilities

The JWT middleware is responsible for the following:

1. Read the `Authorization` header.
2. Confirm the header exists.
3. Confirm the header uses the Bearer scheme.
4. Extract the token string.
5. Verify the token using the shared JWT secret.
6. Decode the authenticated user payload.
7. Attach the decoded user information to the request object.
8. Stop the request with a `401` response when verification fails.
9. Keep protected controllers free from token parsing logic.

The middleware should not:

1. Query the database unless a later authorization rule requires it.
2. Generate tokens.
3. Handle login or signup logic.
4. Contain route-specific business rules.

6. Status Codes

`200 OK`

1. Returned when the protected route is accessed with a valid token.

`401 Unauthorized`

1. Returned when the header is missing.
2. Returned when the Bearer token is missing or malformed.
3. Returned when the token is expired.
4. Returned when the token signature is invalid.

`403 Forbidden`

1. Use only if a future authorization rule allows authentication but denies access to a specific resource.
2. Not required for basic token verification alone.

`500 Internal Server Error`

1. Returned for unexpected middleware failures unrelated to authentication status.

7. Edge Cases

1. Extra spaces in the `Authorization` header should be handled carefully.
2. Lowercase `bearer` should be treated consistently if supported by the parser.
3. Requests with no header must fail immediately.
4. Requests with multiple tokens must be rejected.
5. Expired tokens must not reach protected controllers.
6. Tampered tokens must not be accepted.
7. Protected routes should behave consistently whether called from Postman, browser clients, or server-to-server consumers.

8. Protected Route Flow

The protected route flow is the final outcome of the middleware design:

1. A client calls a protected endpoint with a Bearer token.
2. The middleware extracts and verifies the token.
3. The decoded user identity is attached to the request.
4. The controller receives an authenticated request context.
5. The controller uses the identity only after authentication is complete.
6. The route returns protected data or performs the protected operation.

This architecture keeps authentication centralized and prevents repeated token parsing in each controller.
