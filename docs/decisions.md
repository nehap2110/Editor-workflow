# Decisions

## Decision 1

* **Chose:** JWT-based authentication with role-based authorization handled on the backend.
* **Rejected:** Relying only on frontend route protection or storing user permissions entirely on the client.
* **Why:** Frontend checks improve the user experience but cannot be trusted for security. Since Writers and Editors have different permissions, authorization needs to be enforced by the server for every protected operation.

## Decision 2

* **Chose:** MongoDB with Mongoose for application data.
* **Rejected:** A relational database such as MySQL/PostgreSQL.
* **Why:** The application contains document-oriented entities such as articles, revisions, comments, and history records. MongoDB provides a flexible structure that fits the evolving article workflow, while Mongoose provides schemas, validation, relationships, and convenient querying.

## Decision 3

* **Chose:** Keep the article lifecycle rules and transition validation on the backend.
* **Rejected:** Allowing the frontend to determine whether a status transition is valid.
* **Why:** Article transitions have important business rules, such as who can approve an article, which states can be scheduled or published, and when a revision is required. Keeping these rules on the server prevents clients from bypassing workflow restrictions and keeps the business logic consistent.

## Decision 4

* **Chose:** Use direct application routes for navigation such as returning to the review queue or dashboard.
* **Rejected:** Using browser-history navigation such as `navigate(-1)` for important workflow navigation.
* **Why:** History-based navigation depended on how the user reached the page and could result in navigation loops or returning to an unexpected screen. Explicit routes make the workflow predictable and independent of browser history.

## Decision 5

* **Chose:** Handle published article changes through a revision workflow instead of directly modifying the published article.
* **Rejected:** Allowing Writers or Editors to directly overwrite published content.
* **Why:** Published content needs to remain traceable and historically accurate. Creating a revision preserves the previously published version while allowing new changes to go through the editorial review process.

## Decision 6

* **Chose:** Keep the backend as a single Express application with modular routes/controllers/services.
* **Rejected:** Splitting the system into multiple microservices.
* **Why:** The application is relatively small and has a tightly connected workflow. A modular monolithic backend reduces deployment and operational complexity while still keeping responsibilities separated within the codebase.

## Decision 7

* **Chose:** Use server-side search, filtering, sorting, and pagination for articles.
* **Rejected:** Loading all articles into the frontend and performing these operations only in React.
* **Why:** Server-side processing reduces the amount of data transferred to the browser and scales better as the number of articles increases. It also ensures that filtering and pagination operate consistently against the source of truth in the database.

## Decision 8

* **Chose:** Initially use browser-history navigation for some "Back" actions because it was simple and reused the user's navigation path.

* **Rejected:** At first, explicit route navigation was considered unnecessary for these buttons.

* **Why:** During testing, history-based navigation caused a loop between the Article Detail, Review Queue, and Dashboard screens. This showed that workflow navigation should not depend on the user's previous browser history.

* **Later reversed:** The decision to use `navigate(-1)` was reversed. The affected buttons were changed to explicit routes such as `/editor/review` and `/dashboard`, making navigation deterministic.
