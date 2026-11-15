"use client";

import { useState, useTransition } from "react";
import { saveExamMarks } from "@/server/exam.actions";
import { calculateKeralaGrade } from "@/lib/grading";
import { Save, Check, AlertCircle, Award } from "lucide-react";

interface StudentMarkItem {
  studentId: string;
  candidateCode: string;
  name: string;
  caMark: number;
  esaMark: number;
  totalMark: number;
  grade: string;
  status: string;
}

interface Props {
  examId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  caMax: number;
  esaMax: number;
  initialMarks: StudentMarkItem[];
}

export function MarksEntryClient({
  examId,
  courseId,
  courseCode,
  courseName,
  caMax,
  esaMax,
  initialMarks,
}: Props) {
  const [marks, setMarks] = useState<StudentMarkItem[]>(initialMarks);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleMarkChange = (
    studentId: string,
    field: "caMark" | "esaMark",
    value: number
  ) => {
    setMarks((prev) =>
      prev.map((item) => {
        if (item.studentId !== studentId) return item;
        const ca = field === "caMark" ? value : item.caMark;
        const esa = field === "esaMark" ? value : item.esaMark;
        const total = Number((ca + esa).toFixed(2));
        const { grade, status } = calculateKeralaGrade(total);
        return {
          ...item,
          [field]: value,
          totalMark: total,
          grade,
          status,
        };
      })
    );
    setMessage(null);
  };

  const handleSave = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await saveExamMarks(
        examId,
        courseId,
        marks.map((m) => ({
          studentId: m.studentId,
          caMark: m.caMark,
          esaMark: m.esaMark,
        }))
      );

      if (res?.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setMessage({
          type: "success",
          text: `Continuous Assessment & Exam marks saved successfully for ${courseCode} ${courseName}.`,
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Course Info Banner */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            {courseCode}
          </span>
          <h3 className="text-base font-bold text-slate-900 mt-1">{courseName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            University of Kerala Framework • Continuous Assessment (Max: {caMax}) • End Semester Exam
            (Max: {esaMax})
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="text-xs font-semibold px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          {isPending ? "Publishing..." : "Save & Publish Marks"}
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <Check className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Marks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 w-16 text-center">Sl. No</th>
              <th className="px-6 py-3">Candidate Code</th>
              <th className="px-6 py-3">Candidate Name</th>
              <th className="px-6 py-3 text-center">CA Mark (Max {caMax})</th>
              <th className="px-6 py-3 text-center">ESA Mark (Max {esaMax})</th>
              <th className="px-6 py-3 text-center">Total (100)</th>
              <th className="px-6 py-3 text-center">Grade</th>
              <th className="px-6 py-3 text-center">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {marks.map((item, idx) => (
              <tr key={item.studentId} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 text-center font-medium text-slate-400">{idx + 1}</td>
                <td className="px-6 py-4 font-mono font-bold text-indigo-700">
                  {item.candidateCode}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                <td className="px-6 py-4 text-center">
                  <input
                    type="number"
                    min={0}
                    max={caMax}
                    step="0.5"
                    value={item.caMark}
                    onChange={(e) =>
                      handleMarkChange(item.studentId, "caMark", parseFloat(e.target.value) || 0)
                    }
                    className="w-20 text-center text-sm font-semibold rounded-lg border border-slate-300 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <input
                    type="number"
                    min={0}
                    max={esaMax}
                    step="0.5"
                    value={item.esaMark}
                    onChange={(e) =>
                      handleMarkChange(item.studentId, "esaMark", parseFloat(e.target.value) || 0)
                    }
                    className="w-20 text-center text-sm font-semibold rounded-lg border border-slate-300 py-1 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4 text-center font-bold text-slate-900">{item.totalMark}</td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                      item.grade.startsWith("A")
                        ? "bg-emerald-100 text-emerald-800"
                        : item.grade.startsWith("B")
                        ? "bg-blue-100 text-blue-800"
                        : item.grade.startsWith("C")
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.grade}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      item.status === "PASSED"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
