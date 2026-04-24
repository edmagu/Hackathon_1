# AI Group Project Organizer

A student-focused project management tool powered by AI. Think of it as a simplified **Trello + Google Calendar + AI project manager** for student teams.

## Features

- **Create group projects** with name, description, due date, and team members
- **AI-generated project plans** using GPT-4o-mini (with a realistic mock fallback when no API key is set):
  - Project phases with timelines
  - Tasks assigned to team members
  - Internal deadlines
  - Meeting agenda
  - Reminder schedule
  - Final submission checklist
- **Manual task progress updates** — mark tasks as Not Started, In Progress, or Completed
- **Kanban-style task board** grouped by phase
- **Submission checklist** grouped by category with checkbox persistence

## Tech Stack

| Layer    | Technology |
|----------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend  | Node.js + Express + TypeScript |
| AI       | OpenAI GPT-4o-mini |
| Storage  | JSON file (no database required) |

## Getting Started

### Prerequisites
- Node.js 18+
- (Optional) OpenAI API key for real AI generation

### Run the Backend
```bash
cd backend
npm install
# With real AI (optional):
OPENAI_API_KEY=sk-... npm run dev
# Without API key (uses realistic demo plan):
npm run dev
```

The backend runs on **http://localhost:3001**.

### Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173** and proxies API calls to the backend.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/projects` | List all projects |
| POST   | `/api/projects` | Create a new project |
| GET    | `/api/projects/:id` | Get a single project |
| PUT    | `/api/projects/:id` | Update project (incl. task status) |
| DELETE | `/api/projects/:id` | Delete a project |
| POST   | `/api/ai/generate` | Generate AI project plan |

## Project Structure

```
├── backend/
│   └── src/
│       ├── index.ts          # Express server entry
│       ├── storage.ts        # JSON file storage
│       └── routes/
│           ├── projects.ts   # Project CRUD
│           └── ai.ts         # AI generation
├── frontend/
│   └── src/
│       ├── App.tsx
│       ├── types.ts
│       ├── api.ts
│       └── components/
│           ├── ProjectList.tsx
│           ├── CreateProject.tsx
│           ├── ProjectDetail.tsx
│           ├── TeamMembers.tsx
│           ├── TaskBoard.tsx
│           ├── MeetingAgenda.tsx
│           ├── ReminderSchedule.tsx
│           └── SubmissionChecklist.tsx
└── data/                     # Auto-created JSON storage
```
