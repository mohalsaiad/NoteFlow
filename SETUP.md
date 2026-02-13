# NoteFlow Setup Guide

**Team Members:**
- Ahmar Usman (ID: 1751130)
- Mohammad AlSaiad (ID: 1750755)
- Yazan Al Rifaee (ID: 1751157)

## Quick Start

### Important Note for Windows PowerShell Users

If you encounter PowerShell execution policy errors when running `npm` commands, use `npm.cmd` instead:
- `npm install` → `npm.cmd install`
- `npm start` → `npm.cmd start`
- `npm test` → `npm.cmd test`

Alternatively, use Command Prompt (cmd.exe) instead of PowerShell.

### 1. Backend Setup

```bash
cd backend
npm.cmd install
npm.cmd start
```

Backend runs on: **http://localhost:3000**

**Note:** The backend uses in-memory storage, so all data will be reset when you restart the server.

### 2. Frontend Setup

In a new terminal:

```bash
cd noteflow-frontend
npm.cmd install
ng serve
```

Frontend runs on: **http://localhost:4200**

**Note:** The first build may take 1-2 minutes. Subsequent builds will be faster.

### 3. Access the Application

1. Open your browser and navigate to: `http://localhost:4200`
2. You'll see the **Registration** page first
3. Create a new account:
   - Username: minimum 3 characters
   - Password: minimum 6 characters
   - Confirm password must match
4. After registration, you'll be redirected to the **Login** page
5. Login with your credentials
6. Start using NoteFlow!

## Features Overview

### User Features
- ✅ **Registration**: Create your own account
- ✅ **Login/Logout**: Secure authentication with logout button in navigation
- ✅ **Notes Management**: Create, edit, delete notes
- ✅ **Search**: Search notes by title or content
- ✅ **Sort**: Sort by last modified, created date, or title
- ✅ **Tags**: Add tags to notes and filter by tags
- ✅ **Import**: Import notes from JSON files
- ✅ **Export**: Export notes to JSON or PDF format
- ✅ **Settings**: View user information

### Technical Features
- Multi-user support (each user sees only their notes)
- JWT token-based authentication
- Progress tracking for export jobs
- Confirmation dialogs for destructive actions
- Responsive UI design

## Running Tests

### Frontend Unit Tests

```bash
cd noteflow-frontend
ng test
```

### Frontend Tests with Coverage

```bash
cd noteflow-frontend
ng test --code-coverage
```

Coverage report will be generated in `coverage/` directory. Target coverage is 60%+.

## Project Structure

### Frontend (`noteflow-frontend/`)
```
src/app/
├── components/          # UI components
│   ├── login/          # Login page
│   ├── register/       # Registration page
│   ├── notes-list/     # Notes list with search/filter
│   ├── note-detail/    # Create/edit note
│   ├── import-export/  # Import/export functionality
│   └── settings/       # User settings
├── services/           # Business logic
│   ├── auth.service.ts
│   ├── notes.service.ts
│   └── import-export.service.ts
├── models/             # TypeScript interfaces
├── guards/             # Route guards (auth)
└── interceptors/       # HTTP interceptors
```

### Backend (`backend/`)
```
backend/
├── server.js           # Main Express server
├── package.json        # Dependencies
└── uploads/           # Temporary file uploads (created automatically)
```

## Common Issues and Solutions

### Issue 1: PowerShell Execution Policy Error

**Error:**
```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded. 
The file is not digitally signed.
```

**Solutions:**
1. **Use npm.cmd** (Recommended):
   ```bash
   npm.cmd install
   npm.cmd start
   ```

2. **Use Command Prompt** instead of PowerShell

3. **Change Execution Policy** (requires admin):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Issue 2: PDF Export Not Opening

**Problem:** PDF file downloads but won't open or shows as corrupted.

**Solution:**
1. Make sure pdfkit is installed:
   ```bash
   cd backend
   npm.cmd list pdfkit
   ```

2. If not installed, install it:
   ```bash
   npm.cmd install pdfkit --legacy-peer-deps
   ```

3. Restart the backend server

4. Try exporting again

### Issue 3: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
1. Find and stop the process using port 3000:
   ```bash
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Or change the port in `backend/server.js`:
   ```javascript
   const PORT = 3001; // Change to different port
   ```

### Issue 4: Angular CLI Not Found

**Error:** `'ng' is not recognized as an internal or external command`

**Solution:**
1. Install Angular CLI globally:
   ```bash
   npm.cmd install -g @angular/cli
   ```

2. Or use npx:
   ```bash
   npx ng serve
   ```

### Issue 5: CORS Errors

**Error:** CORS policy blocking requests

**Solution:**
- Make sure backend is running on port 3000
- Make sure frontend is running on port 4200
- Check that CORS is enabled in `backend/server.js`

## Development Tips

1. **Hot Reload**: Both frontend and backend support hot reload during development
2. **Browser DevTools**: Use browser DevTools (F12) to debug frontend issues
3. **Console Logs**: Check browser console and terminal for error messages
4. **Network Tab**: Use browser Network tab to inspect API requests/responses

## Default Data

- **Backend**: Starts with no users (registration required)
- **Notes**: Empty initially - create notes through the UI
- **Data Persistence**: In-memory only (resets on server restart)

## Production Considerations

Before deploying to production:

1. **Change JWT Secret**: Update `JWT_SECRET` in `backend/server.js`
2. **Use Database**: Replace in-memory storage with a database (MongoDB, PostgreSQL, etc.)
3. **Environment Variables**: Move configuration to environment variables
4. **HTTPS**: Use HTTPS in production
5. **Error Handling**: Add comprehensive error handling and logging
6. **Input Validation**: Add server-side input validation
7. **Rate Limiting**: Add rate limiting to prevent abuse
8. **File Storage**: Use proper file storage (AWS S3, etc.) instead of local uploads folder

## API Testing

You can test the API endpoints using:
- **Browser**: Navigate to `http://localhost:3000/api/...` (for GET requests)
- **Postman**: Import the API endpoints and test with authentication
- **curl**: Use curl commands with Bearer token

Example curl command:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/notes
```

## Getting Help

If you encounter issues:
1. Check the browser console for frontend errors
2. Check the terminal for backend errors
3. Verify both servers are running
4. Check that ports 3000 and 4200 are not blocked
5. Ensure all dependencies are installed correctly

## Next Steps

After setup:
1. Create your account
2. Create some test notes
3. Try searching and filtering
4. Test import/export functionality
5. Explore all features!

Happy note-taking! 📝
