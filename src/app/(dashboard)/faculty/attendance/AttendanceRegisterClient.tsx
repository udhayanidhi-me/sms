"use client";

import { useState, useTransition } from "react";
import { saveAttendanceRegister } from "@/server/attendance.actions";
import { Check, X, Clock, Calendar, CheckCheck, Save, AlertCircle } from "lucide-react";

interface StudentRegisterItem {
  studentId: string;
  candidateCode: string;
  name: string;
  status: string;
}

interface Props {
  programId: string;
  programName: string;
  semester: number;
  section: string;
  initialDate: string;
  initialRegister: StudentRegisterItem[];
}

export function AttendanceRegisterClient({
  programId,
  programName,
  semester,
  section,
  initialDate,
  initialRegister,
}: Props) {
  const [date, setDate] = useState(initialDate);
  const [register, setRegister] = useState<StudentRegisterItem[]>(initialRegister);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const updateStatus = (studentId: string, status: string) => {
    setRegister((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, status } : item))
    );
    setMessage(null);
  };

  const markAll = (status: string) => {
    setRegister((prev) => prev.map((item) => ({ ...item, status })));
    setMessage(null);
  };

  const handleSave = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await saveAttendanceRegister({
        programId,
        semester,
        section,
        dateStr: date,
        entries: register.map((r) => ({
          studentId: r.studentId,
          status: r.status,
        })),
      });

      if (res?.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setMessage({
          type: "success",
          text: `Attendance saved successfully for ${new Date(date).toLocaleDateString("en-IN")}.`,
        });
      }
    });
  };

  const presentCount = register.filter((r) => r.status === "PRESENT").length;
  const absentCount = register.filter((r) => r.status === "ABSENT").length;

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Class Schedule</span>
            <h3 className="text-sm font-bold text-slate-900">
              {programName} • Sem {semester} (Section {section})
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Session Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={() => markAll("PRESENT")}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" /> All Present
          </button>

          <button
            type="button"
            onClick={() => markAll("ABSENT")}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1.5"
          >
            <X className="w-3.5 h-3.5" /> All Absent
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isPending ? "Submitting..." : "Save Register"}
          </button>
        </div>
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

      {/* Summary Chips */}
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
        <span className="px-3 py-1 rounded-full bg-slate-100">
          Enrolled: <strong className="text-slate-900">{register.length}</strong>
        </span>
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
          Present: <strong>{presentCount}</strong>
        </span>
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-800">
          Absent: <strong>{absentCount}</strong>
        </span>
      </div>

      {/* Register Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 w-16 text-center">Sl. No</th>
              <th className="px-6 py-3">Candidate Code</th>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3 text-center">Attendance Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {register.map((item, idx) => (
              <tr key={item.studentId} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 text-center font-medium text-slate-400">{idx + 1}</td>
                <td className="px-6 py-4 font-mono font-bold text-indigo-700">
                  {item.candidateCode}
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatus(item.studentId, "PRESENT")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        item.status === "PRESENT"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      Present
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus(item.studentId, "ABSENT")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        item.status === "ABSENT"
                          ? "bg-red-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700"
                      }`}
                    >
                      Absent
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus(item.studentId, "LATE")}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        item.status === "LATE"
                          ? "bg-amber-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                      }`}
                    >
                      Late
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
