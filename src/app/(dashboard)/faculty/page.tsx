import { getFacultyDashboardStats } from "@/server/dashboard.actions";
import { BookOpen, CalendarCheck, FileCheck2, User, Award, Clock } from "lucide-react";
import Link from "next/link";

export default async function FacultyDashboardPage() {
  const data = await getFacultyDashboardStats();
  const { faculty, allocations, notices } = data;

  return (
    <div className="space-y-8">
      {/* Faculty Profile Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-2xl">
            {faculty?.user.name ? faculty.user.name[0] : "F"}
          </div>
          <div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase tracking-wider">
              {faculty?.employeeCode}
            </span>
            <h2 className="text-2xl font-bold mt-1">{faculty?.user.name}</h2>
            <p className="text-sm text-indigo-200/80">
              {faculty?.designation} • Department of {faculty?.departmentName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/faculty/attendance"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all shadow-md shadow-indigo-600/30"
          >
            <CalendarCheck className="w-4 h-4" />
            Class Attendance
          </Link>
          <Link
            href="/faculty/marks"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all"
          >
            <FileCheck2 className="w-4 h-4" />
            CA Mark Entry
          </Link>
        </div>
      </div>

      {/* Allocated Teaching Courses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Allocated Academic Papers ({allocations.length})
          </h3>
          <span className="text-xs text-slate-500">Academic Year 2026-2027</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allocations.map((alloc) => (
            <div
              key={alloc.id}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {alloc.course.code}
                </span>
                <span>{alloc.course.credits} Credits</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {alloc.course.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {alloc.course.program.name} • Semester {alloc.course.semester}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>CA Max: {alloc.course.caMaxMarks}</span>
                <span>ESA Max: {alloc.course.esaMaxMarks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Notices Feed */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Faculty & Academic Circulars</h3>
        <div className="space-y-3">
          {notices.map((n) => (
            <div key={n.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-bold text-indigo-600">{n.category}</span>
                <span>{new Date(n.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{n.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
