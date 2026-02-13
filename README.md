# NoteFlow – Notes & Export Tool

**Course Project – Software Engineering**

Team Members:
- Ahmar Usman (ID: 1751130)
- Mohammad AlSaiad (ID: 1750755)
- Yazan Al Rifaee (ID: 1751157)

---

# 1. Project Overview

NoteFlow is a web-based note management application built with:

- Angular 20 (Frontend)
- Node.js + Express (Backend)
- JSON-based persistent storage
- JWT authentication
- Playwright (E2E testing)
- Karma (Unit testing)

The system allows users to:

- Register and login
- Create, edit, delete notes
- Search, sort, and filter by tags
- Import notes via JSON file upload
- Export notes (JSON or PDF)
- Track progress of long-running export tasks

The project fulfills all mandatory meta-requirements of the course.

---

# 2. System Architecture

User (Browser)  
↓  
Angular Frontend (Port 4200)  
↓ HTTP (REST API)  
Express Backend (Port 3000)  
↓  
JSON Persistence (backend/data/)

Key Features:

- Angular Router navigation
- Route Guards for protected pages
- JWT-based authentication
- Persistent storage (notes survive backend restart)
- Long-running export job with progress polling
- File upload and download functionality

---

# 3. Project Structure

```
NoteFlow/
│
├── backend/                 # Express backend API
├── noteflow-frontend/       # Angular frontend
├── documentation/           # All submission documentation
└── README.md                # This file
```

---

# 4. Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20)

Install Angular CLI if needed:

```bash
npm install -g @angular/cli
```

---

# 5. Installation & Running the Application

## Step 1 – Start Backend

```bash
cd backend
npm install
npm start
```

Backend runs at:

http://localhost:3000

---

## Step 2 – Start Frontend

Open a new terminal:

```bash
cd noteflow-frontend
npm install
ng serve
```

Frontend runs at:

http://localhost:4200

---

# 6. Testing

## 6.1 Unit Tests (Karma)

Run:

```bash
cd noteflow-frontend
ng test --watch=false --code-coverage --browsers=ChromeHeadless
```

Coverage Results (Latest Run):

- Statements: 95%+
- Branches: 90%+
- Functions: 90%+
- Lines: 95%+

All exceed the required 60% threshold.

---

## 6.2 E2E Tests (Playwright)

Make sure backend and frontend are running.

Then execute:

```bash
cd noteflow-frontend
npm run e2e
```

E2E test coverage includes:

- User registration and login
- Note creation (CRUD flow)
- Import JSON file and result summary
- Export with long-running progress tracking

All tests must pass inside the VirtualBox VM.

---

# 7. Persistent Storage

Notes and users are stored in:

```
backend/data/
```

Data is:

- Loaded on backend startup
- Saved on create/update/delete/import
- Persisted across backend restarts

This fulfills the persistent storage requirement (R21).

---

# 8. Documentation

All required documentation is located in:

```
/documentation
```

Included documents:

- Requirements Specification
- Final Design (UML structural + behavioral diagrams)
- Requirements Coverage Audit



---

# 9. Meta-Requirement Compliance

The project fulfills:

- Angular-based frontend
- Angular Router menu navigation
- Backend utilized by frontend
- File upload & download functionality
- Long-running backend task with progress display
- Meaningful dialog window
- Karma test runner
- Coverage > 60%
- E2E tests implemented
- Runnable inside VirtualBox VM

---

# 10. Running Inside VirtualBox VM

Inside the VM:

1. Install dependencies
2. Start backend
3. Start frontend
4. Run tests
5. Verify functionality

The VM has been tested to ensure reproducibility.

---

# 11. Educational Purpose

This project was developed for academic purposes and demonstrates:

- Full-stack web development
- REST API design
- Authentication & authorization
- Test-driven validation
- Software architecture documentation
- Engineering planning and traceability

---

# 12. Submission Contents

The submission includes:

- VirtualBox VM (cloud link provided)
- Complete documentation folder
- Source code ZIP (without node_modules)

---

End of README.
