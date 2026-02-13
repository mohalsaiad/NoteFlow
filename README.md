# NoteFlow - Notes & Export Tool

**Team Members:**
- Ahmar Usman (ID: 1751130)
- Mohammad AlSaiad (ID: 1750755)
- Yazan Al Rifaee (ID: 1751157)

NoteFlow is a web-based application that enables users to create, manage, and store textual notes. The system supports multiple users with registration and login functionality, and includes importing notes from files and exporting notes through asynchronous backend processing.

## Project Structure

```
NoteFlow/
├── noteflow-frontend/    # Angular frontend application
├── backend/              # Node.js/Express backend API
└── README.md            # This file
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```
**Note for Windows PowerShell users:** If you encounter execution policy errors, use `npm.cmd install` instead of `npm install`. See Troubleshooting section below.

3. Start the backend server:
```bash
npm start
```
**Note for Windows PowerShell users:** Use `npm.cmd start` if you encounter execution policy errors.

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd noteflow-frontend
```

2. Install dependencies:
```bash
npm install
```
**Note for Windows PowerShell users:** Use `npm.cmd install` if you encounter execution policy errors.

3. Start the development server:
```bash
ng serve
```

The frontend will run on `http://localhost:4200`

## Getting Started

1. Open your browser and go to: `http://localhost:4200`
2. You'll see the registration page first
3. Create a new account with a username and password
   - Username must be at least 3 characters
   - Password must be at least 6 characters
4. After registration, you'll be redirected to the login page
5. Login with your credentials
6. Start creating and managing your notes!

## Features

- **User Registration & Authentication**: Create accounts and login securely with JWT tokens
- **Multi-User Support**: Each user can only see and manage their own notes
- **Notes Management**: Create, read, update, and delete notes
- **Search**: Search notes by title and content
- **Sort**: Sort notes by last modified, created date, or title
- **Tags**: Tag notes and filter by tags
- **Import**: Import notes from JSON files with validation
- **Export**: Export notes to JSON or PDF format (with progress tracking)
- **PDF Export**: Proper PDF generation using pdfkit library
- **Confirmation Dialogs**: Safety confirmations for destructive actions
- **Logout Button**: Quick logout access from the navigation bar
- **Settings Page**: View user information and account management

## Troubleshooting

### PowerShell Execution Policy Error

If you encounter an error like:
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded. The file is not digitally signed.
```

**Solution:** Use `npm.cmd` instead of `npm` in PowerShell:
```bash
npm.cmd install
npm.cmd start
```

Alternatively, you can:
- Use Command Prompt (cmd.exe) instead of PowerShell
- Change PowerShell execution policy (requires admin rights):
  ```powershell
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### PDF Export Not Opening

If PDF files don't open correctly:
1. Make sure the backend server has been restarted after installing pdfkit
2. Check that pdfkit is installed: `npm.cmd list pdfkit` in the backend directory
3. Try exporting again - the PDF should now be a valid PDF file

## Testing

### Frontend Tests

Run unit tests:
```bash
cd noteflow-frontend
ng test
```

Run tests with coverage:
```bash
ng test --code-coverage
```

Coverage report will be in `coverage/` directory.

## API Endpoints

All endpoints require authentication (Bearer token) except `/api/auth/register` and `/api/auth/login`.

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/notes` - List notes (with query params: search, tags, sortBy)
- `GET /api/notes/:id` - Get note
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/tags` - Get all tags
- `POST /api/export` - Start export job
- `GET /api/jobs/:id` - Get export status
- `GET /api/export/:id` - Download export file
- `POST /api/import` - Import notes (multipart/form-data)

## Technical Details

### Backend
- Uses in-memory storage - data resets on server restart
- JWT-based authentication with 24-hour token expiration
- PDF generation using pdfkit library
- File upload handling with multer
- CORS enabled for localhost:4200

### Frontend
- Angular 20 with standalone components
- Reactive forms for user input
- HTTP interceptors for automatic token attachment
- Route guards for protected routes
- Responsive design with SCSS styling

## Notes

- Backend uses in-memory storage - data resets on server restart
- Each user can only see and manage their own notes
- Export PDF uses pdfkit library for proper PDF generation
- JWT secret should be changed in production
- CORS is enabled for localhost:4200

## Requirements Compliance

This project fulfills all requirements from the course:

- ✅ Angular-based frontend
- ✅ Angular Router for navigation
- ✅ Backend service (Node.js/Express)
- ✅ Karma test runner
- ✅ Test coverage > 60%
- ✅ User authentication with registration
- ✅ Multi-user support
- ✅ Notes CRUD operations
- ✅ Search, sort, tag, filter functionality
- ✅ Import/Export with progress tracking
- ✅ File upload/download
- ✅ Confirmation dialogs
- ✅ Settings component
- ✅ Logout functionality

## License

This project is created for educational purposes.
