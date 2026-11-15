import { getAdminDashboardStats } from "@/server/dashboard.actions";
import { createNotice } from "@/server/notice.actions";
import {
  Users,
  GraduationCap,
  CreditCard,
  Building2,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  Megaphone,
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Administrative Console
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Overview of MGCSIILS institutional metrics, admissions, and collections.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Admit New Student
          </Link>
          <Link
            href="/admin/fees"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium shadow-sm transition-colors"
          >
            <CreditCard className="w-4 h-4 text-slate-500" />
            Fee Register
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Enrolled Students</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalStudents}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">Active Law Batches</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Faculty Strength</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalFaculty}</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">Professors & Lecturers</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Fees Collected</p>
            <h3 className="text-2xl font-bold text-emerald-700 mt-1">
              ₹{stats.totalFeeCollected.toLocaleString("en-IN")}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1">
              of ₹{stats.totalFeeBilled.toLocaleString("en-IN")} Billed
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Fee Dues Outstanding</p>
            <h3 className="text-2xl font-bold text-amber-700 mt-1">
              ₹{stats.totalFeePending.toLocaleString("en-IN")}
            </h3>
            <p className="text-xs text-amber-600 font-medium mt-1">Pending Semester Dues</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Admissions & Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Admissions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Student Admissions</h3>
            <Link
              href="/admin/students"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View Directory &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Candidate Code</th>
                  <th className="px-6 py-3">Student Name</th>
                  <th className="px-6 py-3">Program</th>
                  <th className="px-6 py-3">Batch</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {stats.recentStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-900">
                      {s.candidateCode}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{s.user.name}</div>
                      <div className="text-xs text-slate-400">{s.user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-700">
                      {s.program.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {s.batch} (Sem {s.semester}-{s.sectionName})
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Circulars & Notice Publisher */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-base">
              <Megaphone className="w-5 h-5 text-indigo-600" />
              <h3>Publish Campus Notice</h3>
            </div>

            <form action={createNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">
                  Circular Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Semester Exam Timetable Released"
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="GENERAL">General</option>
                    <option value="ACADEMIC">Academic</option>
                    <option value="EXAM">Examinations</option>
                    <option value="FEES">Fees & Dues</option>
                    <option value="EVENT">Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">
                    Audience
                  </label>
                  <select
                    name="targetRole"
                    className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="ALL">Entire Campus</option>
                    <option value="STUDENT">Students Only</option>
                    <option value="FACULTY">Faculty Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase">
                  Notice Body
                </label>
                <textarea
                  name="content"
                  required
                  rows={3}
                  placeholder="Details of the announcement..."
                  className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
              >
                Broadcast Announcement
              </button>
            </form>
          </div>

          {/* Active Circulars Feed */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs">
              Recent Campus Notices
            </h4>
            <div className="space-y-3">
              {stats.recentNotices.map((n) => (
                <div key={n.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                    <span className="font-semibold text-indigo-600 uppercase">{n.category}</span>
                    <span>{new Date(n.createdAt).toLocaleDateString("en-IN")}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800">{n.title}</h5>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
