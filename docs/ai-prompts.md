# AI Prompts

I used AI as a development assistant during the project for understanding requirements,
debugging specific issues, reviewing implementation details, and getting suggestions
for individual features. The main implementation decisions, integration, testing,
and corrections were done as part of my development work.

## Understanding the Assignment

### Prompt

> Go through the Editorial Workflow assignment requirements and help me identify
> the main features that need to be implemented. Break the requirements into
> manageable development tasks and point out any important workflow restrictions.

### How I used the response

I used the response to understand the assignment and organize the development work.
I then implemented the features incrementally and checked them against the original
requirements.

---

## Article Workflow

### Prompt

> I have implemented the article workflow with different statuses. Help me check
> whether the status transitions and editor/writer permissions cover the assignment
> requirements. Point out any missing or invalid transitions.

### How I used the response

I used the suggestions as a checklist while testing the workflow. I verified the
transitions in the backend and adjusted the conditions where required.

---

## Article Creation and Submission Bug

### Prompt

> When I save an article and then submit it, a duplicate article is sometimes
> created. Help me trace the frontend and backend flow and identify why the same
> article is not being reused.

### What I found

The article ID returned after creation was not consistently being reused during
the next operation.

### Fix

I updated the flow so that the saved article's MongoDB `_id` is placed in the
edit URL and reused when the article is submitted.

---

## Article Detail Rendering Issue

### Prompt

> The Article Detail page becomes blank after fetching an article. The response
> contains populated section and author objects. Help me identify the rendering
> issue.

### What I found

Some populated MongoDB fields were objects, but the frontend was trying to render
the complete object directly.

### Fix

I updated the UI to render the required properties, such as `section.name` and
the relevant author/editor fields.

---

## Navigation Issue

### Prompt

> The Back to Queue and Back to Dashboard buttons sometimes return to the wrong
> page. Check whether using browser history is causing the problem and suggest a
> safer approach.

### What I found

Using `navigate(-1)` depended on the user's previous browser history and could
lead to an unintended route.

### Fix

I changed the navigation to explicit routes such as `/editor/review` and
`/dashboard`.

---

## Database Schema Review

### Prompt

> Review the MongoDB/Mongoose models I have created and help me document their
> fields, relationships, and responsibilities for the project documentation.

### How I used the response

I compared the suggestions with the actual models in the project and documented
the structures that are actually implemented.

The final project uses:

- `User`
- `Section`
- `Article`
- `ArticleRevision`
- `ArticleHistory`

Section assignments are represented using the `writers` array inside `Section`,
and comments are represented as `COMMENT` entries in `ArticleHistory`.

---

## Revisions for Published Articles

### Prompt

> I need to make sure published articles are not edited directly. Suggest a
> clean way to handle revisions while keeping the original published article
> unchanged until the revision is approved and published.

### How I used the response

I used the suggestion to review the existing revision flow and verify that
published content remains unchanged while a revision is being reviewed.

---

## Search, Filtering and Pagination

### Prompt

> Review my article listing API and suggest improvements for server-side search,
> filtering, sorting and pagination. The filters include section, status and
> author.

### How I used the response

I used the suggestions to review the query logic and verify that filtering,
sorting and pagination were being handled on the server rather than only on
the frontend.

---

## Scheduling and Overdue Alerts

### Prompt

> Help me debug the scheduling and overdue alert behavior. When an article is
> rescheduled, a previously dismissed overdue alert should be able to appear
> again when the article becomes overdue.

### What I checked

I checked the scheduling controller and the alert-related fields on the Article
model.

### Fix

The scheduling flow resets the overdue alert dismissal fields so that a new
overdue alert can be generated after rescheduling.

---

## Final Requirement Review

### Prompt

> Review the completed Editorial Workflow project against the 10 core assignment
> requirements. Give me a checklist of things I should manually test before
> submission.

### How I used the response

I used the checklist for final testing of authentication, roles, sections,
articles, workflow transitions, search/filtering, scheduling, publishing,
revisions, history, dashboard information, and overdue alerts.

I also checked that the documentation reflects the actual implementation and
that optional features are not presented as completed unless they were actually
implemented.