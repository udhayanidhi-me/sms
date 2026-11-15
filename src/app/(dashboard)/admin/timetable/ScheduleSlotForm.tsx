"use client";

import { useState, useTransition } from "react";
import { createTimetableSlot } from "@/server/timetable.actions";
import { PlusCircle, AlertCircle, CheckCircle2 } from "lucide-react";

interface Option {
  id: string;
  label: string;
}

interface Props {
  sections: Option[];
  courses: Option[];
  faculties: Option[];
  classrooms: Option[];
  defaultSectionId: string;
}

const PERIOD_TIMES: Record<number, { start: string; end: string }> = {
  1: { start: "09:30", end: "10:30" },
  2: { start: "10:30", end: "11:30" },
  3: { start: "11:45", end: "12:45" },
  4: { start: "01:45", end: "02:45" },
  5: { start: "02:45", end: "03:45" },
};

export function ScheduleSlotForm({
  sections,
  courses,
  faculties,
  classrooms,
  defaultSectionId,
}: Props) {
  const [sectionId, setSectionId] = useState(defaultSectionId);
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [facultyId, setFacultyId] = useState(faculties[0]?.id || "");
  const [classroomId, setClassroomId] = useState(classrooms[0]?.id || "");
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [period, setPeriod] = useState(1);

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ error?: string; success?: boolean } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    const timing = PERIOD_TIMES[period] || { start: "09:30", end: "10:30" };

    startTransition(async () => {
      const res = await createTimetableSlot({
        dayOfWeek: Number(dayOfWeek),
        period: Number(period),
        startTime: timing.start,
        endTime: timing.end,
        sectionId,
        courseId,
        facultyId,
        classroomId,
      });

      if (res?.error) {
        setResult({ error: res.error });
      } else {
        setResult({ success: true });
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold text-base">
        <PlusCircle className="w-5 h-5 text-indigo-600" />
        <h3>Schedule Class Lecture (With Clash Detection)</h3>
      </div>

      {result?.error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{result.error}</span>
        </div>
      )}

      {result?.success && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Lecture slot successfully scheduled without conflicts.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Class Section
          </label>
          <select
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Subject Paper
          </label>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Faculty / Teacher
          </label>
          <select
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Classroom / Hall
          </label>
          <select
            value={classroomId}
            onChange={(e) => setClassroomId(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 px-2.5 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {classrooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Day & Period
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
              className="w-full text-xs rounded-lg border border-slate-300 px-2 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={1}>Mon</option>
              <option value={2}>Tue</option>
              <option value={3}>Wed</option>
              <option value={4}>Thu</option>
              <option value={5}>Fri</option>
            </select>
            <select
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="w-full text-xs rounded-lg border border-slate-300 px-2 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value={1}>P1</option>
              <option value={2}>P2</option>
              <option value={3}>P3</option>
              <option value={4}>P4</option>
              <option value={5}>P5</option>
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending ? "Validating..." : "Assign Slot"}
          </button>
        </div>
      </form>
    </div>
  );
}
