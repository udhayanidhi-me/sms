"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  FileCheck2,
  Award,
  Receipt,
  GraduationCap,
  Calendar,
  Briefcase,
  UserCheck,
} from "lucide-react";

interface SidebarProps {
  role: "ADMIN" | "FACULTY" | "STUDENT";
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const adminNav = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Master Timetable", href: "/admin/timetable", icon: Calendar },
    { label: "Faculty & Workload", href: "/admin/faculty", icon: Briefcase },
    { label: "Student Directory", href: "/admin/students", icon: Users },
    { label: "Fees & Collections", href: "/admin/fees", icon: CreditCard },
  ];

  const facultyNav = [
    { label: "Dashboard", href: "/faculty", icon: LayoutDashboard },
    { label: "Teaching Schedule", href: "/faculty/timetable", icon: Calendar },
    { label: "Attendance Register", href: "/faculty/attendance", icon: CalendarCheck },
    { label: "Continuous Assessment", href: "/faculty/marks", icon: FileCheck2 },
    { label: "Class Tutor Mentorship", href: "/faculty/tutor", icon: UserCheck },
  ];

  const studentNav = [
    { label: "Academic Snapshot", href: "/student", icon: GraduationCap },
    { label: "Class Timetable", href: "/student/timetable", icon: Calendar },
    { label: "Statement of Marks", href: "/student/results", icon: Award },
    { label: "Attendance Record", href: "/student/attendance", icon: CalendarCheck },
    { label: "Fee Ledger & Receipts", href: "/student/fees", icon: Receipt },
  ];

  const navItems = role === "ADMIN" ? adminNav : role === "FACULTY" ? facultyNav : studentNav;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] no-print">
      <div className="p-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {role} Workspace
        </span>
      </div>

      <nav className="p-3 space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 text-xs text-slate-400">
        <p className="font-medium text-slate-600">SLCM Engine v1.1</p>
        <p>University of Kerala Standard</p>
      </div>
    </aside>
  );
}
