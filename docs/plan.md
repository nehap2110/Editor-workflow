# Plan

## How did you break the work into sessions?

I planned the work around the approximately 12-hour time budget, splitting the development into focused sessions of roughly two hours.

### Session 1 — Setup and Authentication

* Reviewed all ten requirements and identified the core article workflow.
* Set up the frontend, backend, database, and project structure.
* Implemented authentication and the Writer/Editor roles.
* Added protected routes and server-side authorization.

### Session 2 — Sections and Articles

* Implemented section creation, editing, archiving, and restoration.
* Added Writer assignments to sections.
* Implemented article creation and editing.
* Connected articles with their sections and authors.

### Session 3 — Article Workflow

* Implemented the main lifecycle:
  `Draft → In Review → Approved → Scheduled → Published`
* Added server-side validation for workflow transitions.
* Implemented the restriction preventing an article's author from approving their own article.
* Added scheduling, publishing, and unpublishing.

### Session 4 — Revisions and History

* Implemented the revision flow for published articles.
* Added article history for creation, status changes, revisions, and comments.
* Ensured published content could not be directly overwritten.

### Session 5 — Search and Bulk Operations

* Implemented server-side search, filtering, sorting, and pagination.
* Added bulk scheduling and unpublishing.
* Added per-article success/rejection results.
* Implemented editorial calendar CSV export.

### Session 6 — Dashboard and Alerts

* Implemented dashboard statistics and publishing activity.
* Added section/status breakdowns.
* Implemented overdue publishing alerts and dismissal behavior.

### Session 7 — Testing, Debugging and Documentation

* Tested the main Writer and Editor workflows.
* Fixed integration and navigation issues.
* Verified the application after deployment.
* Completed the required documentation files.

---

## What order did you build in, and why that order?

I built the system from its foundational dependencies toward the higher-level workflow features.

The order was:

```text
Project Setup
      ↓
Authentication & Roles
      ↓
Sections & Assignments
      ↓
Articles
      ↓
Article Lifecycle
      ↓
Publishing & Revisions
      ↓
Search & Bulk Operations
      ↓
Dashboard & Alerts
      ↓
Testing & Deployment
      ↓
Documentation
```

Authentication and authorization came first because permissions affect almost every part of the application.

I built sections before articles because every article belongs to a section, and Writers can only create articles in sections they are assigned to.

The article lifecycle was implemented after basic article management because scheduling, publishing, approval, and unpublishing all depend on article state.

Revisions and history were built around the lifecycle so that important workflow changes remained traceable.

Search, bulk actions, dashboard information, and alerts were implemented after the article workflow was stable because these features depend on article and status data.

Finally, I focused on testing, debugging, deployment, and documentation.

---

## What did you estimate versus what it actually took?

The assignment provided an approximate **12-hour total budget**, so I initially planned to spend roughly 12 hours across the implementation and documentation.

My initial estimate was:

| Area                              | Estimated Time |
| --------------------------------- | -------------: |
| Setup, authentication and roles   |        2 hours |
| Sections and article management   |        2 hours |
| Article lifecycle and publishing  |        2 hours |
| Revisions and history             |      1.5 hours |
| Search and bulk operations        |      1.5 hours |
| Dashboard and overdue alerts      |         1 hour |
| Testing, debugging and deployment |         1 hour |
| Documentation                     |         1 hour |
| **Total**                         |   **12 hours** |

The actual time distribution changed during development because some workflow and integration issues took longer than expected.

The areas that required additional debugging were mainly:

* Article lifecycle transitions
* Published article revision handling
* Frontend/backend integration
* Article rendering
* Navigation between workflow screens
* Deployment configuration

**Actual time spent:** approximately 14-15 hours.

The estimate was therefore treated as a prioritization guide rather than a strict allocation for every individual feature.

---

## What did you cut when you ran short?

When time became limited, I prioritized the ten required goals over optional improvements. The assignment explicitly treats the ten goals as the cutoff and the stretch ideas as optional.

I kept the core functionality required for the submission, including:

* Authentication and role-based authorization
* Sections and Writer assignments
* Article management
* Complete article lifecycle
* Publishing and revisions
* Server-side search/filtering/pagination
* Bulk operations
* Editorial calendar CSV export
* Dashboard
* Immutable history
* Overdue publishing alerts

I cut or deprioritized:

* Real-time collaborative editing
* External CMS integrations
* Advanced notification infrastructure
* Advanced analytics
* Additional UI polish that was not necessary for the workflow
* Optional stretch features such as visual revision diff and public preview

I also prioritized fixing functional issues over adding new features. If a bug affected a required workflow, I fixed it before spending time on optional improvements.

This allowed me to focus the limited time on delivering a complete and testable implementation of the required editorial workflow.
