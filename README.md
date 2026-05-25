# Student Portal

Modern student management dashboard built with Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui.

## Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:1200**

## Login

| Username | Password |
|----------|----------|
| `admin`  | `admin`  |

## Build

```bash
npm run build
npm run start
```

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (Sidebar, Card, Table, Badge, Input, Button)
- **Lucide React** (icons)

## Project Structure

```
app/
├── (dashboard)/          # Auth-guarded route group
│   ├── layout.tsx        # Sidebar + header shell
│   ├── dashboard/        # Overview stats + enrolled students
│   ├── students/         # Student list with search
│   ├── fees/             # Fee records with collection summary
│   ├── timetable/        # Weekly schedule cards
│   ├── courses/          # Course catalog
│   └── tests/            # Exam schedule
├── login/                # Login page
├── layout.tsx            # Root layout with AuthProvider
├── page.tsx              # Redirects to /dashboard
└── globals.css           # Tailwind theme + base styles
components/
├── layout/AppSidebar.tsx # Collapsible sidebar navigation
└── ui/                   # shadcn/ui components
lib/
├── auth.tsx              # Auth context + JWT mock
├── data.ts               # Typed JSON data loader
├── utils.ts              # cn() utility
└── data/                 # JSON mock files
```

## Mock Data

All data is served from `lib/data/*.json`:

- `students.json` — 5 student records
- `fees.json` — Fee payment records
- `timetable.json` — Weekly class schedule
- `courses.json` — Course/program details
- `tests.json` — Exam schedule
- `auth.json` — Login credentials + fake JWT
