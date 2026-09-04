# 📰 Editorial Workflow

A full-stack **Editorial Workflow Management System** designed to streamline the complete article publishing lifecycle — from content creation and editorial review to scheduling and publication.

The platform provides separate workflows for **Writers and Editors**, with secure role-based access control, section management, article review, publishing, revisions, search & filtering, bulk operations, audit history, dashboard analytics, and overdue publishing alerts.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

* Secure user authentication using JWT
* Role-based access control
* Protected frontend routes
* Protected backend APIs
* Server-side authorization for every sensitive operation
* Different permissions for Writers and Editors

### ✍️ Writer Workflow

Writers can:

* Create new articles
* Save articles as drafts
* Edit their own drafts
* Submit articles for editorial review
* View article status
* Add comments
* Create revisions for published articles
* Work only with their assigned sections

### 🧑‍💼 Editor Workflow

Editors can:

* View articles requiring review
* Review submitted articles
* Approve articles written by other users
* Manage sections
* Assign writers to sections
* Create and manage articles
* Schedule articles
* Publish articles
* Unpublish published articles
* Monitor overdue publishing alerts

> **Important:** An editor cannot approve their own article.

---

## 📝 Article Lifecycle

Articles move through a controlled editorial workflow:

```text
┌─────────┐
│  Draft  │
└────┬────┘
     │ Submit
     ▼
┌────────────┐
│ In Review  │
└─────┬──────┘
      │ Approve
      ▼
┌──────────┐
│ Approved │
└────┬─────┘
     │
     ├───────────────┐
     │               │
     ▼               ▼
 Publish Now      Schedule
     │               │
     ▼               ▼
┌───────────┐   ┌───────────┐
│ Published │   │ Scheduled │
└───────────┘   └─────┬─────┘
                      │
                      ▼
                 ┌───────────┐
                 │ Published │
                 └───────────┘
```

The backend validates workflow transitions so that users cannot perform invalid state changes.

---

## 🔄 Published Article Revisions

Published articles cannot be directly modified.

When a published article needs changes:

```text
Published Article
       │
       ▼
 Create Revision
       │
       ▼
     Draft
       │
       ▼
   In Review
       │
       ▼
    Approved
       │
       ▼
Scheduled / Published
       │
       ▼
 Updated Published Article
```

This keeps the currently published content stable while allowing a new version to go through the editorial process.

---

## 📚 Section Management

Editors can manage the sections used by the editorial team.

Supported operations include:

* Create sections
* Edit section information
* Assign an owning editor
* Assign multiple writers
* Remove writers
* Archive sections
* Restore archived sections

Archiving a section does not delete its existing articles.

---

## 🔎 Article Search & Filtering

The article listing provides server-side search and filtering.

Supported filters include:

* Search by title and article body
* Filter by section
* Filter by status
* Filter by author
* Sort articles
* Paginate results

The backend handles filtering and pagination, avoiding unnecessary loading of the complete article collection into the frontend.

---

## ☑️ Bulk Actions

Editors can select multiple articles and perform bulk operations.

Supported actions:

* Schedule multiple articles
* Unpublish multiple articles

Each article is processed independently.

The API returns the result of every operation, including:

```text
Successful operations
Rejected operations
Reason for rejection
```

This ensures that one invalid article does not cause an entire bulk operation to fail.

---

## 📊 Dashboard

The dashboard provides an overview of the current editorial workload.

It includes:

* Articles currently in review
* Open drafts
* Articles scheduled for the current week
* Articles published during the current week
* Articles grouped by status
* Articles grouped by section
* Weekly publishing activity
* Publishing activity for the previous eight weeks

---

## 🕒 Overdue Publishing Alerts

The system detects scheduled articles whose publishing time has passed but which have not yet been published.

Editors can:

* View overdue articles
* See the overdue count
* Identify overdue scheduled content
* Dismiss alerts

If an article is scheduled again after being unpublished and subsequently becomes overdue, a new overdue alert can be generated.

---

## 🧾 Article History & Audit Trail

Important article activities are recorded in an immutable history.

The history can include:

* Article creation
* Status changes
* Previous and new status
* User responsible for the action
* Revision creation
* Publishing actions
* Comments

This provides transparency into how an article moved through the editorial workflow.

---

## 📅 Editorial Calendar Export

Editors can export the editorial calendar as a CSV file.

The export includes relevant information such as:

| Field        | Description              |
| ------------ | ------------------------ |
| Article      | Article title            |
| Section      | Article section          |
| Author       | Article author           |
| Publish Time | Scheduled/published time |

---

# 🛠️ Tech Stack

| Layer               | Technology           |
| ------------------- | -------------------- |
| Frontend            | React + Vite         |
| Styling             | Tailwind CSS         |
| Routing             | React Router         |
| HTTP Client         | Axios                |
| Backend             | Node.js + Express.js |
| Authentication      | JWT                  |
| Database            | MongoDB              |
| ODM                 | Mongoose             |
| API Style           | REST API             |
| API Testing         | Postman              |
| Version Control     | Git + GitHub         |
| Frontend Deployment | Vercel               |
| Backend Deployment  | Render               |

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │   Vite + Tailwind   │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │                     │
                    │ Authentication      │
                    │ Authorization       │
                    │ Article Workflow    │
                    │ Section Management  │
                    │ Bulk Operations     │
                    │ Audit History       │
                    └──────────┬──────────┘
                               │
                               │ Mongoose
                               ▼
                    ┌─────────────────────┐
                    │       MongoDB       │
                    └─────────────────────┘
```

---

# 📁 Project Structure

```text
editorial-workflow/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── ...
│
├── docs/
│   ├── architecture.md
│   ├── schema.md
│   ├── plan.md
│   ├── decisions.md
│   └── ai-prompts.md
│
├── README.md
└── SUBMISSION.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* MongoDB / MongoDB Atlas
* Git

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd editorial-workflow
```

---

## 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

---

## 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Configure the frontend API URL according to the project's environment configuration.

Start the development server:

```bash
npm run dev
```

The frontend will be available at the local URL provided by Vite.

---

# 🔒 Security

The application implements multiple security controls:

* JWT-based authentication
* Protected API endpoints
* Role-based authorization
* Server-side permission checks
* Section-level access control
* Workflow transition validation
* Environment variables for sensitive configuration
* Prevention of unauthorized article operations

Secrets such as database credentials and JWT keys should never be committed to Git.

---

# 🌐 Deployment

The application can be deployed using:

```text
Frontend
   │
   └── Vercel

Backend
   │
   └── Render

Database
   │
   └── MongoDB Atlas
```

Production environment variables should be configured through the respective hosting platforms.

---

# 📖 Documentation

Detailed technical documentation is available in the `docs/` directory.

| Document                                  | Description                                  |
| ----------------------------------------- | -------------------------------------------- |
| [`architecture.md`](docs/architecture.md) | Application architecture and system design   |
| [`schema.md`](docs/schema.md)             | Database models and relationships            |
| [`plan.md`](docs/plan.md)                 | Development and implementation plan          |
| [`decisions.md`](docs/decisions.md)       | Important technical decisions and trade-offs |
| [`ai-prompts.md`](docs/ai-prompts.md)     | AI-assisted development prompts and usage    |

---

# 🧪 Testing

The application should be tested across the complete workflow:

```text
Authentication
      ↓
Writer creates article
      ↓
Save Draft
      ↓
Submit for Review
      ↓
Editor Review
      ↓
Approve
      ↓
Schedule / Publish
      ↓
Published
      ↓
Create Revision
      ↓
Review New Revision
      ↓
Publish Updated Version
```

Additional testing should cover:

* Unauthorized access
* Invalid workflow transitions
* Section permissions
* Search and filters
* Pagination
* Bulk operations
* Overdue alerts
* Article history
* Navigation and protected routes

---

# 🎯 Project Objective

The primary goal of this project is to provide a reliable and structured editorial workflow where content moves through clearly defined stages while maintaining:

* **Security**
* **Role-based permissions**
* **Editorial control**
* **Content consistency**
* **Auditability**
* **Scalability**

The system separates content creation, editorial review, and publishing responsibilities to create a controlled and transparent publishing process.

---

## 👩‍💻 Project

**Editorial Workflow Management System**

Built as a full-stack web application using the MERN stack with role-based editorial workflows and publishing controls.
