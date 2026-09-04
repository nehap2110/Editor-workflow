# Submission

## Links

* **GitHub repository:** `https://github.com/nehap2110/Editor-workflow`
* **Live application:** `https://editor-workflow.vercel.app`

## Notes for the reviewer

The application is deployed with the frontend on Vercel and the backend on Render. If the backend is idle due to the hosting provider's free-tier behavior, the first request may take some additional time while the service wakes up.

Please use the demo credentials below to test the Writer and Editor workflows.

## Demo credentials

| Role   | Email            | Password            |
| ------ | ---------------- | ------------------- |
| Editor | editor@example.com | Editor@123 |
| Writer | writer@example.com | Writer@123 |

## Stack

| Layer    | What you used                                     | Why                                                                                                                 |
| -------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Frontend | React.js, Vite, Tailwind CSS, React Router, Axios | To build a responsive role-based editorial interface with client-side routing and API integration                   |
| Backend  | Node.js, Express.js, REST APIs, JWT               | To provide secure APIs, authentication, authorization, and server-side workflow validation                          |
| Database | MongoDB with Mongoose                             | To store users, sections, articles, revisions, comments, and immutable history                                      |
| Hosting  | Vercel + Render + MongoDB Atlas                   | Vercel provides frontend hosting, Render hosts the backend API, and MongoDB Atlas provides managed database hosting |

## Goal checklist

| #  | Goal                                      | Status | Notes                                                                                                                   |
| -- | ----------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------- |
| 1  | Accounts and roles                        | Done   | Writer and Editor roles are implemented with authentication and server-side authorization.                              |
| 2  | Sections                                  | Done   | Editors can create, edit, archive, restore, and manage writer assignments for sections.                                 |
| 3  | Articles                                  | Done   | Articles include section, title, body, and author information with role-based access.                                   |
| 4  | Article lifecycle                         | Done   | Draft → In Review → Approved → Scheduled → Published workflow is implemented with server-side transition validation.    |
| 5  | Section assignments                       | Done   | Editors can assign writers to sections and access is enforced through the application workflow.                         |
| 6  | Search, filtering, sorting and pagination | Done   | Article search, filtering, sorting, and pagination are handled server-side.                                             |
| 7  | Bulk operations and calendar              | Done   | Bulk scheduling/unpublishing provides per-article results, and the editorial calendar can be exported as CSV.           |
| 8  | Dashboard                                 | Done   | Dashboard provides article/status information, section information, and publishing activity visualization.              |
| 9  | Immutable article history                 | Done   | Article creation, status changes, revisions, and comments/history events are tracked.                                   |
| 10 | Overdue publish alerts                    | Done   | Overdue scheduled articles can be dismissed, and alerts can reappear when rescheduling creates a new overdue condition. |

## How much time did you actually spend?

Approximately 14-15 Hours in total, including implementation, debugging, testing, deployment, and documentation.

## What would you do next, with another 12 hours?

With another 12 hours, I would focus on:

1. Expanding automated tests for article lifecycle transitions, role authorization, revisions, and bulk operations.
2. Improving UI/UX consistency and adding more loading, empty, and error states.
3. Improving validation and API error handling for edge cases.
4. Adding stronger integration tests for the complete Writer → Editor → Publish workflow.
5. Reviewing database indexes and query performance for larger datasets.
6. Adding more detailed deployment and monitoring improvements.

## What are you least happy with in this codebase, and why?

The area I am least happy with is the amount of complexity around workflow state transitions and the related frontend/backend coordination.

The editorial lifecycle has several rules and edge cases, such as approval permissions, scheduling, publishing, unpublishing, revisions, and invalid transitions. While these rules are implemented and validated on the server, this area could be further refactored into more centralized workflow services and better automated test coverage.

Given more time, I would make the workflow logic more modular and increase test coverage so that adding future workflow states or rules would require less changes across the codebase.
