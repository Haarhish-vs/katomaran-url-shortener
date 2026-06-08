Use existing project context.

Reference:

* docs/diagrams/07_Analytics_Flow.png

Task:

Implement Analytics Date Range Filtering.

Follow project architecture and existing coding standards.

Before coding:

1. Analyze current analytics implementation.
2. Review analytics flow diagram.
3. Identify existing analytics response structure.
4. Design the cleanest backend solution.

Goal:

Allow analytics data to be filtered by date range.

Supported Filters:

* Today
* Last 7 Days
* Last 30 Days
* Custom Range

API Requirements:

GET /api/analytics/:urlId?range=today

GET /api/analytics/:urlId?range=7d

GET /api/analytics/:urlId?range=30d

GET /api/analytics/:urlId?from=YYYY-MM-DD&to=YYYY-MM-DD

Files To Review:

* src/analytics/analytics.routes.js
* src/analytics/analytics.controller.js
* src/analytics/analytics.service.js
* prisma/schema.prisma

Requirements:

* Verify URL ownership before returning analytics.
* Filter visits using database queries.
* Preserve existing analytics response structure.
* Maintain controller → service → database separation.
* Add structured logging.
* Add validation for invalid date ranges.
* Return meaningful error responses.

Code Quality:

* No dead code.
* No duplicate logic.
* No unnecessary abstractions.
* Production-ready implementation only.

Output:

1. Current Analytics Audit
2. Date Filter Design
3. API Design Review
4. Required File Changes
5. Complete Code
6. Postman Testing Steps

Important:

Do not modify frontend.
Complete and test backend first.
