# Schema



- Table by table: what columns and types does each one have?

  ### User
  - `_id`: ObjectId
  - `name`: String
  - `email`: String
  - `password`: String
  - `role`: String/Enum

  ### Section
  - `_id`: ObjectId
  - `name`: String
  - `description`: String
  - `owner`: ObjectId (User reference)
  - `writers`: Array of ObjectId (User references)
  - `archived`: Boolean

  ### Article
  - `_id`: ObjectId
  - `title`: String
  - `summary`: String
  - `content`: String
  - `section`: ObjectId (Section reference)
  - `author`: ObjectId (User reference)
  - `editor`: ObjectId (User reference)
  - `status`: String/Enum
  - `submittedAt`: Date
  - `approvedAt`: Date
  - `approvedBy`: ObjectId (User reference)
  - `scheduledAt`: Date
  - `scheduledBy`: ObjectId (User reference)
  - `publishedAt`: Date
  - `publishedBy`: ObjectId (User reference)
  - `editorFeedback`: String
  - `overdueAlertDismissed`: Boolean
  - `overdueAlertDismissedAt`: Date
  - `overdueAlertDismissedBy`: ObjectId (User reference)

  ### ArticleRevision
  - `_id`: ObjectId
  - `article`: ObjectId (Article reference)
  - `title`: String
  - `content`: String
  - `section`: ObjectId (Section reference)
  - `status`: String/Enum
  - `published`: Boolean
  - `publishedAt`: Date

  ### ArticleHistory
  - `_id`: ObjectId
  - `article`: ObjectId (Article reference)
  - `type`: String/Enum
  - `actor`: ObjectId (User reference)
  - `oldStatus`: String
  - `newStatus`: String
  - `revision`: ObjectId (ArticleRevision reference)
  - `comment`: String
  - `createdAt`: Date

- Which relationships are one-to-many, and which are many-to-many?

  **One-to-many:**
  - User → Articles
  - User → Sections
  - Section → Articles
  - Article → ArticleRevisions
  - Article → ArticleHistory

  **Many-to-many:**
  - Users/Writers ↔ Sections through the `writers` array in Section.

- Which constraints are enforced by the database, and which by application code — and why did you draw the line there?

  Mongoose handles basic schema validation such as required fields, data types, enum values, defaults and ObjectId references.

  Application code handles business rules such as role-based authorization, section assignments, article ownership and valid workflow transitions. For example, the backend checks whether a writer is assigned to a section before allowing them to work with an article, and it checks whether an article is in a valid state before scheduling or publishing it.

  I kept these rules in application code because they depend on the current user and the current state of the article, so they cannot be expressed as simple field-level database constraints.

- What did you deliberately denormalise?

  I kept the current article content and workflow information directly in the Article document instead of reconstructing the current version from ArticleRevision records.

  I also keep frequently used publishing and overdue-alert information on the Article document. This makes normal article listing, filtering, scheduling and publishing operations simpler.

- What would break first if this had 100x the data?

  Article search, filtering, sorting and history queries would likely become the first bottlenecks.

  The application performs server-side article searches and filtering, while ArticleHistory continuously grows as more workflow events and comments are recorded.

  At 100x the data, I would first add and review indexes for commonly queried fields, optimise search and pagination, index ArticleHistory by article and creation time, and optimise dashboard aggregation queries. For very large datasets, I would consider dedicated text search and archiving old history records.