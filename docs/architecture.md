# Architecture

## What are the moving pieces, and how do they talk to each other?

The application is divided into three main parts:

1. **Frontend**

   * Built with React.js and Vite.
   * Provides separate interfaces for Writers and Editors.
   * Handles navigation, forms, article management, dashboards, reviews, and workflow actions.
   * Communicates with the backend through REST APIs using Axios.

2. **Backend**

   * Built with Node.js and Express.js.
   * Exposes REST API endpoints for authentication, users, sections, articles, revisions, history, comments, dashboard data, and bulk operations.
   * Handles business rules such as role-based authorization and article lifecycle transitions.
   * JWT is used for authentication, while authorization is enforced on the server.

3. **Database**

   * MongoDB is used as the persistent data store.
   * Mongoose is used for defining models and interacting with MongoDB.
   * The database stores users, sections, articles, revisions, comments, and article history.

The overall communication flow is:

```text
React Frontend
      |
      | REST API / JSON
      ↓
Express Backend
      |
      | Mongoose
      ↓
MongoDB
```

The frontend is responsible mainly for presentation and user interaction, while the backend remains responsible for authentication, authorization, validation, and workflow rules.

---

## Where does each piece run?

### Frontend

The React/Vite frontend runs in the user's browser.

For deployment, it is hosted on **Vercel**.

```text
User Browser
     ↓
Vercel
     ↓
React Application
```

### Backend

The Node.js/Express API runs as a separate server.

It is deployed on **Render**.

```text
React Application
       ↓
Render
       ↓
Express / Node.js API
```

### Database

MongoDB is used as the application's database and is hosted using **MongoDB Atlas**.

```text
Express API
     ↓
Mongoose
     ↓
MongoDB Atlas
```

Environment variables are used for deployment-specific configuration and secrets rather than committing them to the repository.

---

## What is the request path for one representative user action, end to end?

A representative action is a **Writer submitting an article for review**.

### 1. User action

The Writer opens an article in the frontend and clicks **Submit for Review**.

### 2. Frontend request

The React application sends a request to the backend through Axios.

```text
POST /api/articles/:id/submit
```

The request contains the authenticated user's JWT and the article ID.

### 3. Authentication

The Express backend receives the request.

The authentication middleware verifies the JWT and identifies the current user.

If authentication fails, the request is rejected.

### 4. Authorization

The backend checks whether the authenticated user is allowed to perform the operation.

The server does not rely only on the frontend button visibility. The permission is checked again on the server.

### 5. Article validation

The backend loads the article from MongoDB and validates:

* The article exists.
* The current user has access to the article.
* The current workflow status allows submission.
* The requested transition is valid.

For example:

```text
Draft → In Review
```

If the transition is invalid, the backend rejects the request with an appropriate error/reason.

### 6. Database update

If all validations pass, the backend updates the article status in MongoDB.

The corresponding history/audit event is also recorded so that the workflow change remains traceable.

### 7. Response

The backend returns a JSON response to the frontend indicating that the operation succeeded.

```text
MongoDB
   ↑
Express Backend
   ↑
JSON Response
   ↑
React Frontend
   ↑
Writer
```

### End-to-end flow

```text
Writer
  ↓
React UI
  ↓
Axios REST Request
  ↓
Express Route
  ↓
Authentication Middleware
  ↓
Authorization / Workflow Validation
  ↓
Article Service / Controller
  ↓
Mongoose
  ↓
MongoDB
  ↓
History Update
  ↓
JSON Response
  ↓
React UI Update
```

This same general request pattern is used for other workflow operations such as approval, scheduling, publishing, unpublishing, revisions, and bulk actions.

---

## What did you decide not to build, and why?

The implementation focuses on the required editorial workflow rather than adding unrelated features.

### Real-time collaboration

I did not build real-time multi-user editing or live collaborative document editing.

The assignment requires an editorial workflow, review, scheduling, and publishing system rather than a Google Docs-style collaborative editor. Adding real-time synchronization would also introduce additional complexity around conflict resolution and concurrent editing.

### Full external publishing integrations

I did not build integrations with external CMS platforms or social-media publishing systems.

The application manages the publishing lifecycle internally, which keeps the implementation focused on the assignment requirements.

### Advanced notification infrastructure

I did not build a separate email/push notification service.

The application provides workflow information and overdue publishing alerts inside the application without introducing an additional notification infrastructure.

### Complex analytics

The dashboard provides the required editorial metrics and publishing activity, but I did not build a full analytics platform with advanced reporting, custom dashboards, or long-term business intelligence.

### Microservices architecture

I deliberately kept the backend as a modular Express application instead of splitting it into multiple microservices.

For the size and scope of this application, a single backend keeps development, deployment, debugging, and local development simpler while still allowing the business logic to be organized into separate modules.

### Additional stretch features

Optional features outside the core assignment requirements were not prioritized over completing and validating the required workflow. This helped keep the implementation focused on the main editorial use cases and server-side business rules.
