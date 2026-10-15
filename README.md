# Taskflow — Task Management System

A full-stack task management application built for the Full-Stack Developer assignment. It uses **React + Vite** for the frontend and **Node.js + Express** for the REST API. Tasks are stored in a backend in-memory array; there is deliberately no database or Firebase.

## Features

- Dashboard with total, pending, in-progress, and completed task counts
- Create, view, edit, delete, and quick-update task status
- Required title and description validation on client and server
- Status and priority filters; search across title and description
- Sorting by creation date, due date, or priority
- Pagination, loading skeletons, empty states, API error states, and success notifications
- Responsive layout for desktop, tablet, and mobile
- Dark mode
- Centralized API service, separate Express routes/controllers/services, and centralized error handling
- Postman collection and endpoint documentation

## Requirements

- Node.js 18 or newer (Node.js 20 LTS recommended)
- npm

## Quick start

Open a terminal in the project root (`task-management-system`) and install the dependencies:

```bash
npm install
npm run install:all
```

Copy the environment examples:

- Copy `backend/.env.example` to `backend/.env`
- Copy `frontend/.env.example` to `frontend/.env` (optional; defaults are already configured)

Start the frontend and backend together:

```bash
npm run dev
```

Open **http://localhost:5173**. The API runs at **http://localhost:5000**.

Alternatively, start each service in a separate terminal:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Build the frontend for production:

```bash
npm run build
```

Run the API in production mode:

```bash
cd backend
npm start
```

## Environment variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port used by Express |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed frontend origin for CORS |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:5000/api` | API base URL |

## Task model

```json
{
  "id": "UUID",
  "title": "Complete assignment",
  "description": "Build the full-stack task manager",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-10-20",
  "createdAt": "ISO-8601 timestamp",
  "updatedAt": "ISO-8601 timestamp"
}
```

Allowed statuses: `pending`, `in_progress`, `completed`.

Allowed priorities: `low`, `medium`, `high`.

The due date is optional and uses `YYYY-MM-DD`. Title and description are required. Task data is held only in process memory, so it resets when the backend restarts, as required by the assignment.

## REST API

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Purpose | Success | Common errors |
|---|---|---|---|---|
| GET | `/tasks` | List all tasks | `200` | `500` |
| GET | `/tasks/:id` | Get one task | `200` | `404` |
| POST | `/tasks` | Create a task | `201` | `400` |
| PUT | `/tasks/:id` | Update one or more task fields | `200` | `400`, `404` |
| DELETE | `/tasks/:id` | Delete a task | `200` | `404` |
| GET | `/health` | Health check | `200` | `—` |

### Create request example

```http
POST /api/tasks
Content-Type: application/json
```

```json
{
  "title": "Complete assignment",
  "description": "Build the full-stack task manager",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-10-20"
}
```

### Update request example

`PUT /api/tasks/:id` accepts any subset of editable fields. For example, a quick status update can send:

```json
{ "status": "completed" }
```

### Response format

Successful responses use `{ "success": true, "data": ... }`. The list endpoint also returns `count`. Validation errors return `400` with an `errors` object keyed by field. A missing task returns `404` with a clear message.

Import `docs/Task-Management-API.postman_collection.json` into Postman to try all endpoints. The collection uses a `baseUrl` variable and automatically stores a created task ID for follow-up requests.

## Project structure

```text
task-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/task.controller.js
│   │   ├── middleware/errorHandler.js
│   │   ├── routes/task.routes.js
│   │   ├── services/task.service.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/TaskCard.jsx
│   │   ├── components/TaskDetails.jsx
│   │   ├── components/TaskForm.jsx
│   │   ├── pages/ (reserved for future page-level components)
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   └── package.json
├── docs/Task-Management-API.postman_collection.json
├── .gitignore
└── README.md
```

## Git and GitHub submission

Initialize the repository from the project root:

```bash
git init
git add .
git commit -m "Build Taskflow task management system"
git branch -M main
git remote add origin https://github.com/<your-username>/<repository-name>.git
git push -u origin main
```

Create the GitHub repository first, then replace the placeholder remote URL with your repository URL. Do not commit `.env` files or `node_modules`.

## Notes and limitations

- Sample tasks are loaded in memory on backend startup to make the dashboard immediately demonstrable. They are not persisted and can be deleted like other tasks.
- The app is designed to be run locally; configure `CLIENT_ORIGIN` and `VITE_API_URL` when deploying frontend and backend separately.
- Screenshots/demo video are not included in this source package. Capture the running app in your browser after starting both services if the reviewer requests visual evidence.
