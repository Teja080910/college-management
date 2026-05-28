# Implementation Plan

## User Roles & Dashboards

### Admin Dashboard
- **Login Page** — Secure authentication for admin users
- **Dashboard Overview** — Stats cards: total students, pending fees, upcoming exams
- **Student Management** — Add, edit, delete students (full CRUD with search)
- **Fees Status** — View fee payment records, mark fees as paid/unpaid
- **Timetable** — View and edit weekly class schedule
- **Course Details** — View course information, add/edit courses
- **Test Schedule** — View exam schedule, add/edit exams

### Student Dashboard
- **Login Page** — Secure authentication for student users
- **Dashboard Overview** — Enrolled courses, upcoming exams, fee status summary
- **My Courses** — View enrolled courses and course details (read-only)
- **My Timetable** — View personal class schedule (read-only)
- **My Fees** — View fee payment status, make payments
- **My Tests** — View upcoming exams and exam details (read-only)

---

## Architecture: API-First Design (All Platforms)

The **web app** is the single source of truth — it serves mock JSON data via Next.js API routes at `/api/data/[name]` and stores CRUD changes directly to the JSON files on disk.

Both **Mobile (Expo)** and **Flutter** apps are thin clients — they only make HTTP calls to the web app's API. No local storage, no duplicate data.

| Platform | API Layer | Data Source |
|----------|-----------|-------------|
| Web (Next.js) | `lib/api.ts` | Next.js API routes → JSON files on disk |
| Mobile (Expo) | `src/utils/api.ts` *(new)* | HTTP → web app at `http://localhost:1200/api/data/[name]` |
| Flutter | `services/api_service.dart` *(new)* | HTTP → web app at `http://localhost:1200/api/data/[name]` |

**When backend APIs are ready:**
- Change **one base URL** per platform from `localhost:1200` to the backend host
- JWT token from auth is automatically attached as `Authorization: Bearer <token>` header
- All pages, components, state management remain unchanged

---

## Phase 1: Auth System Upgrade (All Platforms)
1. Add student user to `auth.json` mock data (student/student123)
2. Update `AuthContext` to support role-based login (admin vs student), store role in localStorage
3. Create role-based route guards

## Phase 2: Routing Restructure
```
app/
  (admin)/              # Admin group (existing dashboard layout)
    dashboard/
    students/           # CRUD (existing, keep)
    fees/               # CRUD (existing, keep)
    timetable/          # Editable (upgrade from read-only)
    courses/            # Editable (upgrade from read-only)
    tests/              # Editable (upgrade from read-only)
  (student)/            # New student group
    layout.tsx          # Student-specific sidebar + header
    dashboard/          # Student overview
    my-courses/         # Read-only enrolled courses
    my-timetable/       # Read-only personal schedule
    my-fees/            # View + mock payment
    my-tests/           # Read-only exam list
  login/
```

## Phase 3: Student Layout & Components
1. Create `AppSidebarStudent.tsx` — nav: Dashboard, My Courses, My Timetable, My Fees, My Tests
2. Create `(student)/layout.tsx` — similar to admin layout but with student sidebar
3. Add `studentId` field to students mock data for personalization

## Phase 4: Student Pages (Read-Only Views)
1. **Dashboard** — show enrolled courses count, upcoming exams, fee status (filtered by student)
2. **My Courses** — grid cards showing enrolled courses only
3. **My Timetable** — weekly schedule (same data, filtered view)
4. **My Fees** — show own fee record + mock "Pay Now" button
5. **My Tests** — upcoming exams list

## Phase 5: Admin Feature Upgrades
1. **Timetable** — add ability to edit/delete periods (CRUD dialog)
2. **Courses** — add ability to create/edit courses (CRUD dialog)
3. **Tests** — add ability to create/edit exams (CRUD dialog)

## Phase 6: Mock Data Enrichment
- Link students to courses, fees, timetable via `studentId`
- Add `enrolledCourses` array to student records
- Ensure each fee record references a `studentId`

---

## Phase 7: Mobile (Expo) — API Client & Student Screens

### 7a. Create API Service Layer
- Create `src/utils/api.ts` — HTTP client with `fetchData`, `createRecord`, `updateRecord`, `deleteRecord`
- Base URL: `http://localhost:1200/api/data/[name]` (configurable)
- Auto-attach JWT token from auth storage as `Authorization` header
- All data comes from web app's API — **no local data storage**
- Existing `src/data/*.ts` files and `src/utils/store.ts` become obsolete — only `types.d.ts` for type definitions remains

### 7b. Role-Based Navigation & Auth
- Add `student`/`student123` to auth service
- Store `role` in AsyncStorage (only auth data, not business data)
- `useAuth()` exposes `user.role`
- `AppNavigator.tsx`: if `role === 'admin'` → existing 6 tabs; if `role === 'student'` → 5 student tabs
- Student tab bar: Dashboard, My Courses, My Timetable, My Fees, My Tests
- Student icons: `view-dashboard`, `book-open-variant`, `calendar-month`, `currency-inr`, `clipboard-text`

### 7c. Student Screens (5 new files in `src/screens/`)
| Screen | File | Description |
|--------|------|-------------|
| Student Dashboard | `StudentDashboardScreen.tsx` | Enrolled courses count, upcoming exams, fee status badge |
| My Courses | `StudentCoursesScreen.tsx` | Read-only grid of enrolled courses |
| My Timetable | `StudentTimetableScreen.tsx` | Read-only weekly schedule |
| My Fees | `StudentFeesScreen.tsx` | View own fee + "Pay Now" button (mock) |
| My Tests | `StudentTestsScreen.tsx` | Upcoming exams list with details |

---

## Phase 8: Flutter — API Client & Student Screens

### 8a. Create API Service
- Create `services/api_service.dart` — HTTP client with `fetchData`, `createRecord`, `updateRecord`, `deleteRecord`
- Configurable base URL pointing to web app API
- Auto-attach JWT token
- All data from web app's API — **no local data storage**
- Existing `data/*.dart` files and `services/store_service.dart` become obsolete — only models remain

### 8b. Role-Based Navigation & Auth
- Add `student`/`student123` to `auth_service.dart`
- Store `role` in SharedPreferences (only auth data)
- `app_router.dart`: switch bottom nav items and screens based on `user.role`
- Admin: 6 tabs (Dashboard, Students, Fees, Timetable, Courses, Tests)
- Student: 5 tabs (Dashboard, My Courses, My Timetable, My Fees, My Tests)

### 8c. Student Screens (5 new files in `screens/`)
| Screen | File | Description |
|--------|------|-------------|
| Student Dashboard | `student_dashboard_screen.dart` | Enrolled courses, upcoming exams, fee status |
| My Courses | `student_courses_screen.dart` | Read-only enrolled courses |
| My Timetable | `student_timetable_screen.dart` | Read-only schedule |
| My Fees | `student_fees_screen.dart` | View fee + mock payment |
| My Tests | `student_tests_screen.dart` | Upcoming exams |

---

## File Changes Summary

| Platform | New Files | Modified Files |
|----------|-----------|----------------|
| **Web** | 7 (student sidebar, student layout, 5 student pages) | 6 (auth context, admin layout, sidebar, auth.json, 3 admin page upgrades) |
| **Mobile (Expo)** | 6 (api.ts, 5 student screens) | 3 (auth.ts, AuthContext, AppNavigator) |
| **Flutter** | 6 (api_service.dart, 5 student screens) | 3 (auth_service, auth_provider, app_router) |
