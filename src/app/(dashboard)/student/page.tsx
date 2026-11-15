import { getSession } from "@/lib/auth";
import { getStudentDashboardStats } from "@/server/dashboard.actions";
import {
  GraduationCap,
  CalendarCheck,
  Award,
  CreditCard,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session || !session.studentProfileId) {
    redirect("/login");
  }

  const data = await getStudentDashboardStats(session.studentProfileId);
  if (!data) return <div>Student profile not found.</div>;

  const { student, attendancePct, totalClasses, attendedClasses, pendingFees, gpa, notices } = data;

  return (
    <div className="space-y-8">
      {/* Student Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Candidate: {student.candidateCode}
            </span>
            <span className="text-xs text-slate-400">
              Reg: {student.registrationNo || "Assigned"}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-2 uppercase">{student.user.name}</h2>
          <p className="text-sm text-indigo-200/80">
            {student.program.name} • Batch {student.batch} (Semester {student.semester}-Section {student.section})
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Moderator Gladstone CSI Institute of Legal Studies • University of Kerala
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/student/results"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-600/30"
          >
            <Award className="w-4 h-4" />
            Statement of Marks
          </Link>
          <Link
            href="/student/attendance"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all"
          >
            <CalendarCheck className="w-4 h-4" />
            Attendance Log
          </Link>
        </div>
      </div>

      {/* Attendance Shortage Warning Alert */}
      {attendancePct < 75 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-bold text-amber-800">
              Attendance Shortage Warning ({attendancePct}% Recorded)
            </h4>
            <p className="text-xs text-amber-700 mt-0.5">
              University of Kerala regulations mandate a minimum of 75% attendance for semester examination
              hall ticket eligibility. Please contact your Faculty Advisor.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Attendance Rate</span>
            <CalendarCheck className="w-4 h-4 text-slate-400" />
          </div>
          <h3
            className={`text-2xl font-bold mt-2 ${
              attendancePct < 75 ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {attendancePct}%
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {attendedClasses} of {totalClasses} Sessions
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Semester GPA</span>
            <Award className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-indigo-600 mt-2">{gpa.toFixed(2)}</h3>
          <p className="text-xs text-slate-500 mt-1">Scale of 10.00 • {(gpa * 10).toFixed(1)}%</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Enrolled Papers</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{student.examResults.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Semester {student.semester} Curriculum</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Fee Dues Status</span>
            <CreditCard className="w-4 h-4 text-slate-400" />
          </div>
          <h3
            className={`text-2xl font-bold mt-2 ${
              pendingFees > 0 ? "text-amber-600" : "text-emerald-600"
            }`}
          >
            {pendingFees > 0 ? `₹${pendingFees.toLocaleString("en-IN")}` : "Cleared"}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            <Link href="/student/fees" className="text-indigo-600 font-medium hover:underline">
              View Invoices &rarr;
            </Link>
          </p>
        </div>
      </div>

      {/* Main Grid: Enrolled Courses & Circulars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Current Semester Course Performance
            </h3>
            <Link
              href="/student/results"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Print Formal Mark Sheet &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Course Code</th>
                  <th className="px-6 py-3">Course Title</th>
                  <th className="px-6 py-3 text-center">CA Mark</th>
                  <th className="px-6 py-3 text-center">ESA Mark</th>
                  <th className="px-6 py-3 text-center">Total</th>
                  <th className="px-6 py-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {student.examResults.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-indigo-700">
                      {res.course.code}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">{res.course.name}</td>
                    <td className="px-6 py-4 text-center text-slate-700">{res.caMark}</td>
                    <td className="px-6 py-4 text-center text-slate-700">{res.esaMark}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-900">
                      {res.totalMark}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {res.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notices */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-900 mb-4">Official Announcements</h3>
          <div className="space-y-3">
            {notices.map((n) => (
              <div key={n.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-bold text-indigo-600">{n.category}</span>
                  <span>{new Date(n.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">{n.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-3">{n.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
