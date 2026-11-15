import { getFacultyWorkloadSummary } from "@/server/timetable.actions";
import { GraduationCap, Award, BookOpen, Clock, Users, Shield } from "lucide-react";

export default async function AdminFacultyPage() {
  const faculties = await getFacultyWorkloadSummary();

  const principal = faculties.find((f) => f.roleTitle === "PRINCIPAL");
  const vp = faculties.find((f) => f.roleTitle === "VICE_PRINCIPAL");
  const hod = faculties.find((f) => f.roleTitle === "HOD");
  const assistantProfessors = faculties.filter(
    (f) => !["PRINCIPAL", "VICE_PRINCIPAL", "HOD"].includes(f.roleTitle)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Faculty Directory & Teaching Workload
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Academic leadership hierarchy, paper allocations, and weekly teaching workload against statutory UGC/BCI norms.
        </p>
      </div>

      {/* Leadership Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {principal && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-md border border-indigo-700/40">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase tracking-wider">
              Chief Executive & Academic Head
            </span>
            <h3 className="text-xl font-bold mt-2">{principal.name}</h3>
            <p className="text-xs text-indigo-200/80 mt-0.5">{principal.designation}</p>
            <div className="mt-4 pt-3 border-t border-indigo-800/60 flex items-center justify-between text-xs text-indigo-300">
              <span>Code: {principal.employeeCode}</span>
              <span>{principal.departmentName}</span>
            </div>
          </div>
        )}

        {vp && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md border border-slate-700">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 uppercase tracking-wider">
              Academic Coordinator
            </span>
            <h3 className="text-xl font-bold mt-2">{vp.name}</h3>
            <p className="text-xs text-slate-300 mt-0.5">{vp.designation}</p>
            <div className="mt-4 pt-3 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
              <span>Code: {vp.employeeCode}</span>
              <span>{vp.departmentName}</span>
            </div>
          </div>
        )}

        {hod && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 to-purple-950 text-white shadow-md border border-indigo-800/40">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 uppercase tracking-wider">
              Head of Department
            </span>
            <h3 className="text-xl font-bold mt-2">{hod.name}</h3>
            <p className="text-xs text-purple-200/80 mt-0.5">{hod.designation}</p>
            <div className="mt-4 pt-3 border-t border-purple-800/60 flex items-center justify-between text-xs text-purple-300">
              <span>Teaching Load: {hod.weeklyHours} Hrs/Week</span>
              <span>{hod.departmentName}</span>
            </div>
          </div>
        )}
      </div>

      {/* Complete Faculty Roster & Workload Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Faculty Teaching Workload Matrix ({faculties.length} Staff Members)
          </h3>
          <span className="text-xs text-slate-500">UGC Norm Target: 16 Hours / Week</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Faculty Member</th>
                <th className="px-6 py-3">Role & Department</th>
                <th className="px-6 py-3">Class Mentorship</th>
                <th className="px-6 py-3">Assigned Papers</th>
                <th className="px-6 py-3 text-center">Weekly Load</th>
                <th className="px-6 py-3 text-center">Workload Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {faculties.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{f.name}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {f.employeeCode} • {f.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-semibold text-slate-800">{f.designation}</div>
                    <div className="text-xs text-slate-500">{f.departmentName}</div>
                  </td>
                  <td className="px-6 py-4">
                    {f.mentoredSections.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        <Users className="w-3 h-3" />
                        Tutor: {f.mentoredSections.join(", ")}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {f.assignedPapers.length > 0 ? (
                        f.assignedPapers.map((code) => (
                          <span
                            key={code}
                            className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700"
                          >
                            {code}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">Administrative Duty</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="font-bold text-slate-900 text-sm">
                      {f.weeklyHours}{" "}
                      <span className="text-xs font-normal text-slate-400">
                        / {f.maxWeeklyHours} Hrs
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-32 mx-auto space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span>{f.compliancePercentage}%</span>
                        <span className="text-[10px] text-slate-400">
                          {f.weeklyHours >= f.maxWeeklyHours
                            ? "Full"
                            : `${f.maxWeeklyHours - f.weeklyHours}h open`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            f.compliancePercentage >= 75
                              ? "bg-emerald-500"
                              : f.compliancePercentage >= 40
                              ? "bg-indigo-500"
                              : "bg-amber-400"
                          }`}
                          style={{ width: `${Math.min(100, f.compliancePercentage)}%` }}
                        ></div>
                      </div>
                    </div>
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
