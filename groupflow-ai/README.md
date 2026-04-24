# GroupFlow AI

GroupFlow AI is an AI-powered group project organizer for students. This MVP helps teams create a project, add team members, generate a project plan, and track execution in a simple dashboard.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Storage: JSON file (`server/data/db.json`)
- Authentication: None (MVP)

## Project Structure

```text
groupflow-ai/
  client/
    src/
      components/
      pages/
      api/
      utils/
      App.jsx
      main.jsx
  server/
    routes/
    controllers/
    services/
    data/
    app.js
    server.js
  package.json
  README.md
```

## Setup

From `groupflow-ai/`:

```bash
npm run install-all
```

## Run Frontend

```bash
npm run client
```

Frontend runs on `http://localhost:5173`.

## Run Backend

```bash
npm run server
```

Backend runs on `http://localhost:5000`.

## Run Full App (Frontend + Backend)

```bash
npm run dev
```

## Main Features

- Create project with title, course, type, description, due date, and difficulty
- Add team members with skills, availability, and preferred role
- Generate AI plan (fallback planner works without API key)
- Review summary, milestones, tasks, meetings, and checklist
- Save plan and open dashboard
- Track progress with task board (To Do / In Progress / Done)
- Update task status and checklist completion
- Load demo project from home page

## API Overview

- Projects: `POST/GET/GET by id/PUT/DELETE /api/projects`
- Team members: `POST/GET /api/projects/:id/members`, `PUT/DELETE /api/members/:memberId`
- AI plan: `POST /api/projects/:id/generate-plan`
- Tasks: `GET/POST /api/projects/:id/tasks`, `PUT/DELETE /api/tasks/:taskId`
- Checklist: `GET /api/projects/:id/checklist`, `PUT /api/checklist/:checklistItemId`

## Future Improvements

- Real AI provider integration in `aiService`
- Authentication and role permissions
- Calendar/reminder integrations
- Drag-and-drop task board
- Real-time team collaboration
