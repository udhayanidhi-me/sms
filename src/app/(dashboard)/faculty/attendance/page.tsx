import { db } from "@/lib/db";
import { getAttendanceRegister } from "@/server/attendance.actions";
import { AttendanceRegisterClient } from "./AttendanceRegisterClient";

export default async function FacultyAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ programId?: string; semester?: string; date?: string }>;
}) {
  const params = await searchParams;
  const programs = await db.program.findMany({ orderBy: { code: "asc" } });

  const activeProgram = programs.find((p) => p.id === params.programId) || programs[0];
  const semester = parseInt(params.semester || "1") || 1;
  const section = "A";
  const dateStr = params.date || new Date().toISOString().split("T")[0];

  const data = await getAttendanceRegister(
    activeProgram.id,
    semester,
    section,
    dateStr
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Daily Class Attendance Register
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Record student presence for semester sessions. Flags shortage for attendance under 75%.
        </p>
      </div>

      <AttendanceRegisterClient
        programId={activeProgram.id}
        programName={activeProgram.name}
        semester={semester}
        section={section}
        initialDate={dateStr}
        initialRegister={data.register}
      />
    </div>
  );
}
