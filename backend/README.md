# NoteFlow Backend

Node.js/Express backend API for the NoteFlow application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## Default Credentials

- Username: `admin`
- Password: `password`

## API Endpoints

- POST `/api/auth/login` - User authentication
- GET `/api/notes` - Get all notes (with search, filter, sort)
- GET `/api/notes/:id` - Get note by ID
- POST `/api/notes` - Create new note
- PUT `/api/notes/:id` - Update note
- DELETE `/api/notes/:id` - Delete note
- GET `/api/notes/tags` - Get all tags
- POST `/api/export` - Start export job
- GET `/api/jobs/:id` - Get export job status
- GET `/api/export/:id` - Download export file
- POST `/api/import` - Import notes from file
