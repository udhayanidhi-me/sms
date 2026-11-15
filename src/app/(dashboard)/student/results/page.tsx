import { getSession } from "@/lib/auth";
import { getStudentStatementOfMarks } from "@/server/exam.actions";
import { PrintButton } from "./PrintButton";
import { redirect } from "next/navigation";
import { Award, CheckCircle2 } from "lucide-react";

export default async function StudentResultsPage() {
  const session = await getSession();
  if (!session || !session.studentProfileId) {
    redirect("/login");
  }

  const data = await getStudentStatementOfMarks(session.studentProfileId);
  if (!data) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        No published examination marks found.
      </div>
    );
  }

  const { student, exam, results, totalCredits, gpa, percentage, overallStatus } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            University Statement of Marks
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Official semester grade sheet certified under University of Kerala evaluation standards.
          </p>
        </div>
        <PrintButton />
      </div>

      {/* Formal Printable Grade Sheet Document */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-lg p-8 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
          <div className="inline-block p-2 rounded-xl bg-slate-100 mb-2">
            <Award className="w-10 h-10 text-indigo-700 mx-auto" />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-wider text-slate-900 uppercase">
            University of Kerala
          </h1>
          <p className="text-xs font-semibold text-slate-600 tracking-widest uppercase mt-0.5">
            Re-accredited by NAAC with A-GRADE • Thiruvananthapuram, Kerala
          </p>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Centre of Study: Moderator Gladstone CSI Institute of Legal Studies (MGCSIILS), Cheruvarakonam
          </p>
          <div className="mt-4 pt-2 border-t border-slate-200">
            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-800">
              Statement of Marks & Grades
            </h2>
          </div>
        </div>

        {/* Candidate Information Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-slate-700 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="font-semibold text-slate-500">Candidate Name: </span>
            <strong className="text-slate-900 uppercase">{student.user.name}</strong>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Candidate Code: </span>
            <strong className="text-indigo-700 font-mono text-sm">{student.candidateCode}</strong>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Programme: </span>
            <strong className="text-slate-900">{student.program.name}</strong>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Exam Code: </span>
            <strong className="text-slate-900 font-mono">{exam.examCode}</strong>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Examination: </span>
            <span className="text-slate-900">{exam.title}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-500">Month & Year: </span>
            <span className="text-slate-900">{exam.monthYear}</span>
          </div>
        </div>

        {/* Marks Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs border border-slate-300 border-collapse">
            <thead className="bg-slate-100 font-bold uppercase text-slate-700 border-b border-slate-300">
              <tr>
                <th className="p-2.5 border-r border-slate-300 text-center w-10">#</th>
                <th className="p-2.5 border-r border-slate-300">Course Code</th>
                <th className="p-2.5 border-r border-slate-300">Course Title</th>
                <th className="p-2.5 border-r border-slate-300 text-center">Credits</th>
                <th className="p-2.5 border-r border-slate-300 text-center">CA Mark</th>
                <th className="p-2.5 border-r border-slate-300 text-center">ESA Mark</th>
                <th className="p-2.5 border-r border-slate-300 text-center">Total (100)</th>
                <th className="p-2.5 border-r border-slate-300 text-center">Grade Point</th>
                <th className="p-2.5 border-r border-slate-300 text-center">Grade</th>
                <th className="p-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {results.map((r, i) => (
                <tr key={r.id}>
                  <td className="p-2.5 border-r border-slate-200 text-center font-medium text-slate-400">
                    {i + 1}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 font-mono font-bold text-slate-900">
                    {r.course.code}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 font-medium text-slate-800">
                    {r.course.name}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center">{r.course.credits}</td>
                  <td className="p-2.5 border-r border-slate-200 text-center font-semibold text-slate-700">
                    {r.caMark}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center font-semibold text-slate-700">
                    {r.esaMark}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center font-bold text-slate-900">
                    {r.totalMark}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center font-semibold">
                    {r.gradePoint}
                  </td>
                  <td className="p-2.5 border-r border-slate-200 text-center font-bold text-indigo-700">
                    {r.grade}
                  </td>
                  <td className="p-2.5 text-center font-bold text-emerald-700">
                    {r.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Aggregate Summary Box */}
        <div className="grid grid-cols-3 gap-4 border border-slate-300 bg-slate-50 p-4 rounded-xl text-center mb-6">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              Total Course Credits
            </span>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{totalCredits}</div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              Semester GPA (SGPA)
            </span>
            <div className="text-xl font-bold text-indigo-700 mt-0.5">{gpa.toFixed(2)}</div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase">
              Percentage (GPA × 10)
            </span>
            <div className="text-xl font-bold text-emerald-700 mt-0.5">{percentage.toFixed(1)}%</div>
          </div>
        </div>

        {/* Grading Scale Legend */}
        <div className="border border-slate-200 rounded-lg p-3 text-[10px] text-slate-500">
          <p className="font-bold text-slate-700 mb-1">University of Kerala Grading Scale Standard:</p>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 text-center font-mono">
            <span className="bg-slate-100 p-1 rounded">≥90: A+ (9.5)</span>
            <span className="bg-slate-100 p-1 rounded">80-89: A (8.5)</span>
            <span className="bg-slate-100 p-1 rounded">70-79: B+ (7.5)</span>
            <span className="bg-slate-100 p-1 rounded">60-69: B (6.5)</span>
            <span className="bg-slate-100 p-1 rounded">50-59: C+ (5.5)</span>
            <span className="bg-slate-100 p-1 rounded">40-49: C (4.5)</span>
            <span className="bg-slate-100 p-1 rounded">&lt;40: F (0.0)</span>
          </div>
        </div>

        {/* Footer Signatures */}
        <div className="mt-12 pt-8 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600 font-medium">
          <div>
            <p className="font-semibold">Dated: 15-11-2026</p>
            <p className="text-[10px] text-slate-400">Cheruvarakonam, Parassala</p>
          </div>
          <div className="text-center">
            <div className="h-8 border-b border-slate-300 w-32 mb-1"></div>
            <p>Verified By</p>
          </div>
          <div className="text-right">
            <div className="h-8 border-b border-slate-300 w-32 mb-1"></div>
            <p className="font-bold text-slate-800">Controller of Examinations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
