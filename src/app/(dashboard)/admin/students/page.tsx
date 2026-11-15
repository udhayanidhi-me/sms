import { getStudents, createStudentAdmission } from "@/server/student.actions";
import { db } from "@/lib/db";
import { Users, UserPlus, Search, Phone, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; programId?: string }>;
}) {
  const { search, programId } = await searchParams;
  const [students, programs] = await Promise.all([
    getStudents({ search, programId }),
    db.program.findMany({ orderBy: { code: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Student Directory & Admissions
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Enrolled candidates at Moderator Gladstone CSI Institute of Legal Studies.
          </p>
        </div>
      </div>

      {/* Quick Admission Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-base">
          <UserPlus className="w-5 h-5 text-indigo-600" />
          <h3>Direct Candidate Admission Entry</h3>
        </div>

        <form action={createStudentAdmission} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Legal Name *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. ABHIRAMI S NAIR"
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Institutional Email *
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="abhirami@student.mgcsiils.edu.in"
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Candidate Code / Roll No *
            </label>
            <input
              type="text"
              name="candidateCode"
              required
              placeholder="e.g. 47320108"
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Program of Study *
            </label>
            <select
              name="programId"
              required
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Batch & Section
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="batch"
                defaultValue="2026-2031"
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="section"
                defaultValue="A"
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              name="phone"
              placeholder="+91 98470 00000"
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Register Candidate Admission
            </button>
          </div>
        </form>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <form method="GET" className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Search by candidate code, name, or email..."
              className="w-full text-sm rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </form>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{students.length}</span> Candidates
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Candidate Code</th>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Program & Section</th>
                <th className="px-6 py-3 text-center">Attendance</th>
                <th className="px-6 py-3 text-right">Fee Dues</th>
                <th className="px-6 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-indigo-700">
                    {s.candidateCode}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{s.user.name}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" />
                      {s.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 text-xs">{s.program.name}</div>
                    <div className="text-xs text-slate-500">
                      Batch {s.batch} • Sem {s.semester} (Sec {s.section})
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        s.attendancePercentage < 75
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
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
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {s.status}
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
