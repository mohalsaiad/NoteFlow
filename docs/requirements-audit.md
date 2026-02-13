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
- Backend logic verification

---

# MUST Requirements (R01–R21)

| Req ID | Status | Proof (UI / API / Test) | Notes |
|--------|--------|-------------------------|-------|
| R01 – Authentication | ✅ | UI: `/login`, `/register` (Angular Router). API: `POST /api/auth/login`, `POST /api/auth/register`. Test: `auth.service.spec.ts`. | JWT authentication |
| R02 – Logout | ✅ | UI logout button. Code: `AuthService.logout()`. Test covers logout behavior. | Clears localStorage |
| R03 – Create note | ✅ | UI note form. API: `POST /api/notes`. Test: createNote test. | |
| R04 – Edit note | ✅ | UI edit form. API: `PUT /api/notes/:id`. Test: updateNote test. | |
| R05 – Delete note | ✅ | UI delete button. API: `DELETE /api/notes/:id`. Test: deleteNote test. | Confirmation dialog implemented |
| R06 – Notes list view | ✅ | Route `/notes`. Notes list component renders all notes. | |
| R07 – Note detail view | ✅ | Route `/notes/:id`. API: `GET /api/notes/:id`. | |
| R08 – Search notes | ✅ | Query param `?search=`. Backend filtering implemented. | |
| R09 – Sort notes | ✅ | Query param `?sortBy=`. Backend sorting logic. | |
| R10 – Tag notes | ✅ | Tags stored in note model and editable in UI. | |
| R11 – Filter by tags | ✅ | Query param `?tags=tag1,tag2`. Backend filtering implemented. | |
| R12 – Confirmation dialog | ✅ | Confirmation before deletion in UI. | |
| R13 – Export request function | ✅ | API: `POST /api/export`. | |
| R14 – Long-running export process | ✅ | Backend async job (`setTimeout` + `processExport()`). | |
| R15 – Export progress information | ✅ | API: `GET /api/jobs/:id` returns status & progress. | |
| R16 – Progress display in frontend | ✅ | Frontend polls job endpoint and displays progress. | |
| R17 – Download export file | ✅ | API: `GET /api/export/:id` returns JSON or PDF. | |
| R18 – Upload import file | ✅ | API: `POST /api/import` using multer. | |
| R19 – Import validation | ✅ | Backend validates required fields (`title`, `body`). | |
| R20 – Import result summary | ✅ | Response returns `{ created, rejected, errors }`. | |
| R21 – Persistent storage of notes | ✅ | Notes stored server-side in backend arrays (`notes[]`, `users[]`). | Persists during runtime |

---

# SHOULD Requirements (R22–R27)

| Req ID | Status | Proof | Notes |
|--------|--------|-------|-------|
| R22 – Export format selection | ✅ | UI allows JSON or PDF selection. Backend supports both formats. | |
| R23 – Export settings dialog | ✅ | Export modal/dialog implemented in frontend. | |
| R24 – Import progress indicator | ⚠️ | Import summary shown after upload. No live progress bar. | Functional but not real-time |
| R25 – Pagination | ❌ | Not implemented | Optional |
| R26 – Recently edited notes view | ✅ | Default sorting by `lastModified`. | |
| R27 – Input validation feedback | ✅ | ReactiveForms validation + backend error messages. | |

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
| Angular Router used | ✅ | Routes: `/login`, `/register`, `/notes`, `/notes/:id` |
| Backend service used by frontend | ✅ | All data via `HttpClient` to Express API |
| Long-running backend task | ✅ | Async export job with polling |
| Karma test runner used | ✅ | `ng test --code-coverage` |
| Line coverage ≥ 60% | ✅ | 95.58% |
| Branch coverage ≥ 60% | ✅ | 91.66% |
| Function coverage ≥ 60% | ✅ | 90.9% |
| E2E tests implemented | ⚠️ | Manual verification performed |
| VirtualBox VM runnable | ⚠️ | Requires verification in VM |

---

# Final Verification Checklist

- [x] All MUST requirements implemented
- [x] No ❌ in MUST section
- [x] Acceptance coverage thresholds satisfied
- [x] All unit tests passing
- [x] Coverage report generated
- [ ] VM test verified

---

# Summary

**MUST implemented:** 21 / 21  
**SHOULD implemented:** 4 / 6  
**CAN implemented:** 0 / 3

Critical Issues Remaining:
- Pagination not implemented (optional)
- No advanced CAN features

**Ready for Submission:** ☑ Yes ☐ No
