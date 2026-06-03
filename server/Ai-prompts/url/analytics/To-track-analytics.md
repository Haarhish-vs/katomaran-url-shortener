ROLE

Act as a Senior Backend Engineer implementing the Analytics feature.

PROJECT

Katomaran URL Shortener

REFERENCE DOCUMENTS

1. docs/03_Architecture.md
2. docs/diagrams/06_Analytics_Flow.png

IMPORTANT

The Analytics Flow Diagram is the source of truth.

Follow every step exactly as defined in:

docs/diagrams/07_Analytics_Flow.png

CURRENT STATUS

- Authentication completed
- Create URL completed
- Redirect URL completed
- Visit records are created during redirect

TASK

Implement Analytics Retrieval.

FLOW REQUIREMENTS

JWT Verification
→ Ownership Verification
→ URL Lookup
→ Visit Retrieval
→ Click Count Calculation
→ Analytics Response

REQUIREMENTS

- Protected route only
- User must only access their own URLs
- Return total click count
- Return visit records
- Return URL metadata
- No dead code
- No unused imports
- Production-ready implementation

OUTPUT FORMAT

1. Files To Modify
2. Responsibility Mapping
3. Complete Code
4. Postman Test Cases