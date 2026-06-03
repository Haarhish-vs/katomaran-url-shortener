# JWT Implementation Plan

1. File Responsibilities

`src/middleware/auth.middleware.js`

1. Reads the incoming `Authorization` header.
2. Extracts and verifies the Bearer token.
3. Attaches the authenticated user payload to the request object.
4. Stops unauthenticated requests before they reach protected handlers.

`src/utils/jwt.js`

1. Provides the shared JWT verification helper.
2. Centralizes token signing and verification rules.
3. Keeps middleware logic focused on request handling rather than cryptographic details.

`src/auth/auth.routes.js`

1. Mounts protected routes behind the middleware.
2. Ensures route-level access control is applied consistently.

`src/auth/auth.controller.js`

1. Receives authenticated requests.
2. Reads the attached user context from the middleware.
3. Avoids re-parsing or re-verifying tokens.

`src/auth/auth.service.js`

1. Remains focused on authentication and related business rules.
2. Does not own middleware concerns.

2. Middleware Flow

The middleware flow should follow the exact request path used by protected routes:

1. The client sends a request to a protected endpoint.
2. The request includes `Authorization: Bearer <token>`.
3. Express executes middleware before the controller.
4. `auth.middleware.js` reads the `Authorization` header.
5. The middleware verifies that the header exists.
6. The middleware confirms that the value starts with the Bearer scheme.
7. The middleware extracts the raw token string.
8. The middleware passes the token to the JWT verification helper.
9. If verification succeeds, the decoded payload is attached to `req.user`.
10. The middleware calls `next()`.
11. The controller runs with authenticated user context already available.

3. JWT Verification Flow

JWT verification must happen before any protected business logic runs.

1. The middleware receives the raw token string.
2. The token is verified using the shared secret from `src/utils/jwt.js`.
3. Signature validation confirms the token was issued by the server.
4. Expiration validation confirms the token is still valid.
5. The decoded payload is returned only after verification succeeds.
6. The middleware stores the decoded user information on the request object.
7. Downstream handlers trust the attached request user rather than the incoming header.

Verification rules:

1. Never trust the token without signature verification.
2. Never accept a token from query parameters or request body.
3. Never expose the JWT secret in responses or logs.
4. Never allow a verified token to bypass expiration checks.

4. Request Lifecycle

The protected request lifecycle should be predictable and linear:

1. A client requests a protected resource.
2. The request enters the Express middleware chain.
3. The JWT middleware runs before the route controller.
4. The middleware extracts and verifies the token.
5. If the token is valid, the user identity is attached to the request.
6. The request continues into the controller.
7. The controller performs the protected operation.
8. The controller returns the protected response to the client.

If authentication fails at any step, the request must stop immediately.

5. Error Handling Plan

The middleware should return consistent, generic responses.

1. Missing `Authorization` header returns `401 Unauthorized`.
2. Malformed `Authorization` header returns `401 Unauthorized`.
3. Missing Bearer token value returns `401 Unauthorized`.
4. Invalid token signature returns `401 Unauthorized`.
5. Expired token returns `401 Unauthorized`.
6. Unexpected verification failure returns `500 Internal Server Error` only when it is not an authentication failure.

Error response guidance:

1. Keep messages short and generic.
2. Do not reveal whether the token was expired, tampered with, or otherwise invalid.
3. Do not leak implementation details.
4. Do not allow protected controllers to run after a failed check.

6. Testing Plan

Test the middleware with both positive and negative cases.

1. Request a protected route without an `Authorization` header and expect `401`.
2. Request a protected route with an invalid header format and expect `401`.
3. Request a protected route with an invalid token and expect `401`.
4. Request a protected route with an expired token and expect `401`.
5. Request a protected route with a valid token and expect the controller to run.
6. Confirm that `req.user` is available to protected controllers after verification.
7. Confirm that public routes are not blocked by the middleware.

7. Development Checklist

1. Create `src/middleware/auth.middleware.js`.
2. Use `src/utils/jwt.js` for token verification.
3. Attach decoded user data to `req.user`.
4. Apply the middleware only to protected routes.
5. Keep auth routes that do not require login public.
6. Return `401` for all authentication failures.
7. Validate the flow with Postman.
8. Ensure no dead code or duplicate token parsing exists.
