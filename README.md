# Student Management System (SMS)

> A modern, cost-effective, and self-hostable Student Lifecycle Management (SLCM) system engineered for **Moderator Gladstone CSI Institute of Legal Studies (MGCSIILS)**, Cheruvarakonam. Affiliated with the **University of Kerala** and approved by the **Bar Council of India (BCI)**.

---

## Overview

Educational institutions require unified administrative management that respects statutory academic regulations, multi-tier faculty hierarchies, complex weekly class routines, and strict student compliance criteria. 

This system provides a full-featured, zero-bloat administrative suite tailored to professional higher education environments—handling everything from institutional leadership oversight to lecture hall timetables, student attendance thresholds, and University-standard statements of marks.

---

## Core Capabilities

### 1. Institutional Governance & Hierarchy
- **Executive Leadership Console**:
  - **Principal** (`Dr. Lizzie Albert`): High-level institutional KPI monitoring, campus-wide faculty teaching workloads, and administrative circulars.
  - **Vice Principal** (`Keerthi S. Jyothi`): Academic coordinator workspace with master timetable scheduling and conflict management.
  - **Head of Department (Law)** (`Manu S.R.`): Department course allocations, syllabus tracking, and faculty distribution.
- **Designated Class Tutors & Batch Mentors**:
  - Assigned batch mentors (e.g., `Prof. Abhijith J.S.` for B.A. LL.B. Sem 1-A) with a dedicated workspace (`/faculty/tutor`) to monitor ward attendance compliance, identify chronic absentees, and contact guardians.
- **20+ Faculty Member Profiles**:
  - Official faculty directory with designations, qualifications, and allocated papers across all degree programs.

### 2. Clash-Free Master Class Timetable Engine
- **Weekly Schedule Matrix**: 5-period daily routine (Monday to Friday, 09:30 AM – 03:45 PM).
- **Automated Conflict Prevention**:
  - **Teacher Conflict**: Prevents a faculty member from being scheduled in two classrooms simultaneously.
  - **Classroom Conflict**: Prevents double-booking physical lecture halls or moot courts.
  - **Section Conflict**: Prevents scheduling overlapping subject lectures for the same student batch.
- **Physical Campus Hall Allocation**: Maps lectures to designated facilities (`Lecture Hall 101`, `102`, `201`, `Moot Court Hall`, `Central Seminar Hall`).
- **Role-Tailored Views**:
  - Administrators view the full master grid with on-the-fly lecture slot assignment.
  - Faculty members receive a personalized *"My Teaching Schedule"* timetable.
  - Students view their section's daily routine with assigned professors and classrooms.

### 3. Faculty Teaching Workload Compliance
- Live tracking of scheduled weekly teaching hours per staff member against statutory UGC/BCI norms:
  - Assistant Professors: **16 hours / week** target.
  - Associate Professors / HoDs: **14 hours / week** target.
  - Principal: **8 hours / week** executive target.
- Visual compliance indicators highlighting full, under-allocated, and over-allocated faculty members.

### 4. Academic Programs & Curriculum
Configured for all five MGCSIILS law degree programs:
1. **5-Year Integrated B.A. LL.B.** (10 Semesters, Sections A & B)
2. **5-Year Integrated B.Com. LL.B.** (10 Semesters)
3. **5-Year Integrated BBA LL.B.** (10 Semesters)
4. **3-Year Unitary LL.B.** (6 Semesters, Sections A & B)
5. **2-Year LL.M. in Constitutional Law** (4 Semesters)

### 5. Daily Attendance Register & Minimum Threshold Alerts
- Daily period attendance register with bulk shortcuts (*All Present*, *All Absent*, *Toggle*).
- Live calculation of cumulative attendance percentage.
- **Mandatory <75% Shortage Alert**: Automatically flags students whose attendance falls below the minimum required for university exam hall ticket eligibility.

### 6. Examination, Continuous Assessment & SGPA Engine
- Dual-tier mark evaluation: **Continuous Assessment (CA Mark, Max 25)** + **End Semester Assessment (ESA Mark, Max 75)**.
- Automated 10-point University of Kerala grading scale:
  - `A+` (90–100%, GP 9.5)
  - `A` (80–89%, GP 8.5)
  - `B+` (70–79%, GP 7.5)
  - `B` (60–69%, GP 6.5)
  - `C+` (50–59%, GP 5.5)
  - `C` (40–49%, GP 4.5)
  - `F` (<40%, GP 0.0 - Fail)
- Cumulative Semester GPA calculation:
  $$\text{SGPA} = \frac{\sum (\text{Grade Point} \times \text{Credits})}{\sum \text{Credits}}, \quad \text{Percentage} = \text{GPA} \times 10.00$$
- Printable formal **Statement of Marks** matching the University of Kerala SLCM examination format.

### 7. Fee Accounts & Receipts
- Semester fee structures (Tuition, Special Amenities, Library, University Exam fees).
- Payment tracking (`PAID`, `PARTIAL`, `PENDING`), manual collection entry, and downloadable receipts with unique transaction references.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [Next.js 15](https://nextjs.org/) (App Router, React Server Components) |
| **Language** | TypeScript |
| **Styling & UI** | Tailwind CSS, Lucide Icons |
| **Database & ORM** | SQLite (embedded, zero-config) / PostgreSQL with [Prisma ORM](https://www.prisma.io/) |
| **Authentication & RBAC** | Stateless signed JWT cookies (`jose`) with Next.js Edge Middleware route guards |
| **Containerization** | Docker (multi-stage standalone build) & Docker Compose |

---

## Project Structure

```text
/media/Data/sms/
├── prisma/
│   ├── schema.prisma             # Data models (Faculty, Sections, TimetableSlots, Classrooms, Exams, Fees)
│   └── seed.js                   # MGCSIILS institutional seed data
├── src/
│   ├── app/
│   │   ├── (auth)/               # Login portal with one-click role autofill
│   │   ├── (dashboard)/
│   │   │   ├── admin/            # Executive overview, Timetable master, Faculty workload, Admissions, Fees
│   │   │   ├── faculty/          # Course allocations, Attendance register, CA evaluation, Tutor view
│   │   │   └── student/          # Academic snapshot, Timetable, Kerala Univ Statement of Marks, Fee ledger
│   │   ├── globals.css           # Tailwind design tokens & print stylesheets
│   │   └── layout.tsx            # Root layout
│   ├── components/               # Navbar, Sidebar, TimetableGrid, RegisterClient, MarkEntryClient
│   ├── lib/
│   │   ├── auth.ts               # JWT signing, verification, and cookie management
│   │   ├── db.ts                 # Prisma Client singleton
│   │   └── grading.ts            # University of Kerala 10-point grade computation
│   ├── middleware.ts             # Edge route protection and role verification
│   └── server/                   # Server Actions (timetable, attendance, exams, fees, students, notices)
├── Dockerfile                    # Production multi-stage Docker build
├── docker-compose.yml            # 1-Click deployment configuration
└── README.md
```

---

## Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v20 or newer
- **pnpm**: v9 or newer (`npm install -g pnpm`)

### 2. Setup & Installation
```bash
# Clone the repository
git clone https://github.com/udhayanidhi-me/sms.git
cd sms

# Install dependencies
pnpm install

# Initialize database schema & seed institutional data
pnpm prisma db push
pnpm db:seed
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Accounts

All demo accounts share the password: `Password@123`

| Role / Title | Faculty / Student Name | Email Address | Primary Focus |
|---|---|---|---|
| **Principal** | Dr. Lizzie Albert | `principal@mgcsiils.edu.in` | Executive campus KPIs, staff workload compliance, institutional notices |
| **Vice Principal** | Keerthi S. Jyothi | `vp@mgcsiils.edu.in` | Master timetable scheduler, conflict prevention, academic coordination |
| **HoD Law** | Manu S.R. | `hod.law@mgcsiils.edu.in` | Department syllabus tracking, paper allocations, department schedule |
| **Class Tutor** | Abhijith J.S. | `abhijith.js@mgcsiils.edu.in` | Sem 1-A mentorship workspace, absentee tracking, guardian outreach |
| **Student** | Siva Govind V | `siva.govind@student.mgcsiils.edu.in` | Weekly class routine, printable Statement of Marks, fee clearance |

*(One-click demo buttons are available on the login page for instant authentication without typing).*

---

## Production Deployment (Docker Compose)

The application includes an optimized multi-stage `Dockerfile` (standalone Next.js output) and a `docker-compose.yml` for single-command self-hosting:

```bash
docker compose up -d --build
```

The service will run on port `3000` with database files persisted in the `sms-data` Docker volume.

To view container logs:
```bash
docker compose logs -f
```

---

## License

This project is licensed under the terms of the GNU Affero General Public License (AGPL-3.0).
