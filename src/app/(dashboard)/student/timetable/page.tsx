import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getSectionTimetable } from "@/server/timetable.actions";
import { TimetableGrid } from "@/components/TimetableGrid";
import { redirect } from "next/navigation";
import { Calendar } from "lucide-react";

export default async function StudentTimetablePage() {
  const session = await getSession();
  if (!session || !session.studentProfileId) {
    redirect("/login");
  }

  const student = await db.studentProfile.findUnique({
    where: { id: session.studentProfileId },
    include: {
      program: true,
      section: {
        include: {
          classTutor: { include: { user: true } },
          defaultRoom: true,
        },
      },
    },
  });

  if (!student) return <div>Student not found.</div>;

  const sectionId = student.sectionId;
  const slots = sectionId ? await getSectionTimetable(sectionId) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Weekly Class Routine & Timetable
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {student.program.name} • Semester {student.semester} (Section {student.sectionName})
        </p>
      </div>

      <TimetableGrid
        slots={slots}
        title={`Semester ${student.semester} Class Timetable (Section ${student.sectionName})`}
        subtitle={`Class Tutor: ${student.section?.classTutor?.user.name || "Assigned"} • Primary Hall: ${
          student.section?.defaultRoom?.name || "Lecture Hall 101"
        }`}
      />
    </div>
  );
}
