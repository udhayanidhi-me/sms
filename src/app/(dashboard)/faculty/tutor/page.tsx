import { getSession } from "@/lib/auth";
import { getClassTutorMentorship } from "@/server/section.actions";
import { redirect } from "next/navigation";
import { Users, Phone, Mail, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function FacultyTutorPage() {
  const session = await getSession();
  if (!session || !session.facultyProfileId) {
    redirect("/login");
  }

  const sections = await getClassTutorMentorship(session.facultyProfileId);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Class Tutor & Batch Mentorship Workspace
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your mentored section's student welfare, attendance compliance, and guardian communications.
        </p>
      </div>

      {sections.length > 0 ? (
        sections.map((sec) => (
          <div
            key={sec.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Batch Banner */}
            <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 uppercase tracking-wider">
                  Designated Class Tutor: {session.name}
                </span>
                <h3 className="text-xl font-bold mt-2">
                  {sec.program.name} (Section {sec.name})
                </h3>
                <p className="text-xs text-purple-200/80 mt-0.5">
                  Batch {sec.batch} • Semester {sec.semester} • Default Room:{" "}
                  {sec.defaultRoom?.name || "LH-101"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/faculty/attendance"
                  className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-sm hover:bg-slate-100 transition-colors"
                >
                  Mark Class Attendance &rarr;
                </Link>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Candidate Code</th>
                    <th className="px-6 py-3">Student Name</th>
                    <th className="px-6 py-3">Contact Details</th>
                    <th className="px-6 py-3">Guardian Info</th>
                    <th className="px-6 py-3 text-center">Cumulative Attendance</th>
                    <th className="px-6 py-3 text-right">Fee Clearance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sec.students.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-indigo-700">
                        {s.candidateCode}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{s.user.name}</div>
                        <div className="text-xs text-slate-400">{s.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="text-slate-800 font-medium">{s.phone || "N/A"}</div>
                        <div className="text-slate-400 line-clamp-1">{s.address}</div>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="font-semibold text-slate-900">
                          {s.guardianName || "N/A"}
                        </div>
                        <div className="text-slate-500">{s.guardianPhone || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            s.isShortage
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {s.isShortage && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                          {s.attendancePercentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {s.pendingFees > 0 ? (
                          <span className="text-xs font-bold text-amber-600">
                            ₹{s.pendingFees.toLocaleString("en-IN")} Due
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
          <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-800">No Mentored Batch Assigned</h4>
          <p className="text-xs text-slate-500 mt-1">
            You are not currently designated as the Class Tutor for a section. Contact the Office of the Principal or Vice Principal for assignment.
          </p>
        </div>
      )}
    </div>
  );
}
