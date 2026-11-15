import { getSession } from "@/lib/auth";
import { getStudentAttendanceSummary } from "@/server/attendance.actions";
import { redirect } from "next/navigation";
import { CalendarCheck, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";

export default async function StudentAttendancePage() {
  const session = await getSession();
  if (!session || !session.studentProfileId) {
    redirect("/login");
  }

  const summary = await getStudentAttendanceSummary(session.studentProfileId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Attendance Record & Minimum Threshold
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Bar Council of India & University of Kerala attendance compliance tracker.
        </p>
      </div>

      {/* Warning if under 75% */}
      {summary.isShortage && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-bold text-amber-800">
              Low Attendance Warning ({summary.percentage}%)
            </h4>
            <p className="text-xs text-amber-700 mt-0.5">
              Attendance is currently below the mandatory 75% threshold required for examination registration.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Sessions</span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{summary.totalClasses}</h3>
          <p className="text-xs text-slate-500 mt-1">Classroom Lectures</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-emerald-600 uppercase">Classes Attended</span>
          <h3 className="text-2xl font-bold text-emerald-700 mt-1">{summary.attendedClasses}</h3>
          <p className="text-xs text-slate-500 mt-1">{summary.absentClasses} Days Absent</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Compliance Status</span>
          <h3
            className={`text-2xl font-bold mt-1 ${
              summary.isShortage ? "text-amber-600" : "text-emerald-700"
            }`}
          >
            {summary.percentage}%
          </h3>
          <p className="text-xs font-medium mt-1">
            {summary.isShortage ? "Shortage Detected (<75%)" : "Meets BCI Standard (≥75%)"}
          </p>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Recent Session Log</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Session Date</th>
                <th className="px-6 py-3">Recorded By</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {summary.recentEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">
                    {new Date(entry.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-700">
                    {entry.recordedBy}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        entry.status === "PRESENT"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {entry.status === "PRESENT" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
