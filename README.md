# Student Management System (SMS)

> A modern, cost-effective, and fully self-hostable Student Management System built for **Moderator Gladstone CSI Institute of Legal Studies (MGCSIILS)**, Cheruvarakonam, affiliated with the **University of Kerala** and approved by the **Bar Council of India (BCI)**.

---

## Features

- **Role-Based Access Control (RBAC)**: Dedicated workspaces for **Administrators**, **Faculty**, and **Students**.
- **Admissions & Student Directory**: Candidate enrollment, candidate code/roll numbering, program batches, and profile management.
- **Academic Programs & Curriculum**: Configured for 5-Year Integrated B.A. LL.B., B.Com. LL.B., BBA LL.B., 3-Year Unitary LL.B., and 2-Year LL.M. (Constitutional Law).
- **Daily Attendance Register**: Session attendance marking with automatic attendance percentage and **<75% attendance shortage alerts** adhering to University of Kerala and BCI regulations.
- **Continuous Assessment & Mark Evaluation**: Faculty CA mark entry (Max 25) + End Semester Assessment (Max 75) with automated 10-point Kerala University grading (`A+`, `A`, `B+`, `B`, `C+`, `C`, `F`) and SGPA calculation.
- **Official Statement of Marks**: Printable semester grade sheet matching the University of Kerala SLCM examination format.
- **Fees & Ledger Management**: Semester fee schedules (tuition, special fees, library, exam fees), balance tracking, and instant payment receipt generation.
- **Campus Circulars**: Targeted announcements for administrators, faculty, and students.
- **1-Click Self-Hostable**: Single container Docker Compose deployment with persistent storage.

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & ORM**: SQLite (zero-config self-hosting) / PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: Stateless, signed JWT session cookies using `jose` with Edge Middleware guards
- **Containerization**: Docker & Docker Compose

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Initialize Database & Seed Demo Data
```bash
pnpm prisma db push
pnpm db:seed
```

### 4. Start Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials

All demo accounts share the default password: `Password@123`

| Role | Email ID | Access / Features |
|---|---|---|
| **Administrator** | `admin@mgcsiils.edu.in` | Executive dashboard, student admissions, fee registers, campus notices |
| **Faculty** | `anand.kumar@mgcsiils.edu.in` | Course allocations, attendance register, continuous assessment mark entry |
| **Student** | `siva.govind@student.mgcsiils.edu.in` | Academic snapshot, printable statement of marks, attendance compliance, fees |

*(You can also use the one-click demo role buttons directly on the login page).*

---

## Production Deployment (Docker Compose)

Run the entire system in a single command:

```bash
docker compose up -d --build
```

The application will be running on port `3000` with database files persisted in the `sms-data` Docker volume.

---

## License

This project is licensed under the terms of the GNU Affero General Public License (AGPL-3.0).
