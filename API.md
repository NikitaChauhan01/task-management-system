# Task Management API Reference

**Base URL:** `http://localhost:5000/api`

All request and response bodies are JSON. The API stores tasks in process memory and resets after restart.

## `GET /tasks`
Returns tasks sorted by newest creation date first.

**200**
```json
{ "success": true, "count": 1, "data": [{ "id": "...", "title": "Example", "description": "Example description", "status": "pending", "priority": "medium", "dueDate": "2026-10-20", "createdAt": "2026-10-12T12:00:00.000Z", "updatedAt": "2026-10-12T12:00:00.000Z" }] }
```

## `GET /tasks/:id`
Returns one task.

- **200** — task returned in `data`
- **404** — `{ "success": false, "message": "Task not found." }`

## `POST /tasks`
Creates a task. `title` and `description` are required strings. `status` defaults to `pending`; `priority` defaults to `medium`; `dueDate` is optional.

```json
{ "title": "Complete assignment", "description": "Build the full-stack task manager", "status": "pending", "priority": "high", "dueDate": "2026-10-20" }
```

- **201** — task created
- **400** — invalid/missing required fields, invalid status/priority/date, or overlong values

## `PUT /tasks/:id`
Updates any provided editable fields: `title`, `description`, `status`, `priority`, `dueDate`. A partial update is supported for convenient status changes; when title or description is included, it must be non-empty.

- **200** — task updated
- **400** — validation failure
- **404** — task not found

## `DELETE /tasks/:id`
Deletes the task and returns the deleted record.

- **200** — task deleted
- **404** — task not found

## `GET /health`
Returns an API health message with status `200`.

## Validation rules

- `title`: required on create; trimmed; maximum 120 characters
- `description`: required on create; trimmed; maximum 2,000 characters
- `status`: `pending`, `in_progress`, or `completed`
- `priority`: `low`, `medium`, or `high`
- `dueDate`: empty or a date string in `YYYY-MM-DD` format
