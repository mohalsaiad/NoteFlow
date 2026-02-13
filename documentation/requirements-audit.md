# NoteFlow – Requirements Coverage Audit

**Commit Hash:** (insert latest commit hash)  
**Date:** 13.02.2026  
**Verified By:** (Team Member Name)

---

## Legend

- ✅ Implemented
- ⚠️ Partially implemented / needs verification
- ❌ Missing

Proof examples:
- UI route (e.g., `/notes`)
- API endpoint (e.g., `POST /api/export`)
- Unit test
- E2E test
- Backend logic verification

---

# MUST Requirements (R01–R21)

| Req ID | Status | Proof (UI / API / Test) | Notes |
|--------|--------|-------------------------|-------|
| R01 – Authentication | ✅ | UI: `/login`, `/register`. API: `POST /api/auth/login`, `POST /api/auth/register`. Unit: `auth.service.spec.ts`. E2E: login.spec.ts | JWT authentication |
| R02 – Logout | ✅ | Logout button in navbar. Unit test verifies logout logic. | Clears localStorage |
| R03 – Create note | ✅ | UI `/notes/new`. API: `POST /api/notes`. Unit + E2E: notes.spec.ts | |
| R04 – Edit note | ✅ | UI edit form. API: `PUT /api/notes/:id`. Unit test present | |
| R05 – Delete note | ✅ | Delete button + confirmation dialog. API: `DELETE /api/notes/:id`. Unit tested | Meaningful dialog implemented |
| R06 – Notes list view | ✅ | Route `/notes`. Component renders user notes | |
| R07 – Note detail view | ✅ | Route `/notes/:id`. API: `GET /api/notes/:id` | |
| R08 – Search notes | ✅ | Query param `?search=` handled in backend | |
| R09 – Sort notes | ✅ | Query param `?sortBy=` implemented | |
| R10 – Tag notes | ✅ | Tags stored and editable in UI | |
| R11 – Filter by tags | ✅ | Query param `?tags=tag1,tag2` | |
| R12 – Confirmation dialog | ✅ | Confirmation before delete | Required dialog fulfilled |
| R13 – Export request function | ✅ | API: `POST /api/export` | |
| R14 – Long-running export process | ✅ | Async job with progress updates (`processExport`) | Required long-running backend task |
| R15 – Export progress information | ✅ | API: `GET /api/jobs/:id` returns status & progress | |
| R16 – Progress display in frontend | ✅ | Frontend polling + progress bar UI | Verified via E2E |
| R17 – Download export file | ✅ | API: `GET /api/export/:id` returns JSON or PDF | |
| R18 – Upload import file | ✅ | API: `POST /api/import` using multer | |
| R19 – Import validation | ✅ | Backend validates required fields (`title`, `body`) | |
| R20 – Import result summary | ✅ | Returns `{ created, rejected, errors }` | Verified via E2E |
| R21 – Persistent storage of notes | ✅ | JSON persistence (`backend/data/notes.json`, `users.json`) loaded on startup and saved on changes | Persists across backend restarts |

---

# SHOULD Requirements (R22–R27)

| Req ID | Status | Proof                                  | Notes |
|--------|--------|----------------------------------------|-------|
| R22 – Export format selection | ✅ | JSON/PDF dropdown in UI                | |
| R23 – Export settings dialog | ✅ | Dedicated Import & Export page         | |
| R24 – Import progress indicator | ⚠️ | Shows import summary                   |  |
| R25 – Pagination | ❌ | Not implemented                        | Optional |
| R26 – Recently edited notes view | ✅ | Default sorting by `lastModified`      | |
| R27 – Input validation feedback | ✅ | ReactiveForms + backend error messages | |

---

# CAN Requirements (R28–R30)

| Req ID | Status | Proof | Notes |
|--------|--------|-------|-------|
| R28 – Shareable note link | ❌ | Not implemented | Optional |
| R29 – Favorites flag | ❌ | Not implemented | Optional |
| R30 – Scheduled export | ❌ | Not implemented | Optional |

---

# Acceptance / Technical Requirements

| Requirement | Status | Proof |
|-------------|--------|-------|
| Angular-based frontend | ✅ | Angular 20 standalone components |
| Angular Router used | ✅ | `/login`, `/register`, `/notes`, `/notes/:id`, `/import-export` |
| Backend service used by frontend | ✅ | All data via `HttpClient` to Express API |
| Long-running backend task | ✅ | Async export job with polling |
| File upload & download | ✅ | Import + Export implemented |
| Karma test runner used | ✅ | `ng test --code-coverage` |
| Line coverage ≥ 60% | ✅ | 95.58% |
| Branch coverage ≥ 60% | ✅ | 91.66% |
| Function coverage ≥ 60% | ✅ | 90.9% |
| E2E tests implemented | ✅ | Playwright tests for login, CRUD, import, export |
| VirtualBox VM runnable | ⚠️ | Requires final verification inside VM |

---

# Final Verification Checklist

- [x] All MUST requirements implemented
- [x] No ❌ in MUST section
- [x] Acceptance coverage thresholds satisfied
- [x] Unit tests passing
- [x] E2E tests passing
- [x] Coverage report generated
- [ ] VM tested on clean environment
- [ ] VM uploaded with documentation + source ZIP

---

# Summary

**MUST implemented:** 21 / 21  
**SHOULD implemented:** 4 / 6  
**CAN implemented:** 0 / 3

Meta-requirements fulfilled:
- Angular frontend + router
- Backend integration
- File upload & download
- Long-running backend task with progress
- Meaningful dialog
- Unit tests + coverage > 60%
- E2E tests implemented

Critical items remaining:
- Final VM verification
- Cloud upload of VM
- Documentation includes VM download link

---

**Ready for Submission:** ☑ Yes ☐ No
