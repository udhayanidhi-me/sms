import { getSession } from "@/lib/auth";
import { getFacultyTimetable } from "@/server/timetable.actions";
import { TimetableGrid } from "@/components/TimetableGrid";
import { redirect } from "next/navigation";
import { Calendar, Clock, BookOpen } from "lucide-react";

export default async function FacultyTimetablePage() {
  const session = await getSession();
  if (!session || !session.facultyProfileId) {
    redirect("/login");
  }

  const slots = await getFacultyTimetable(session.facultyProfileId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          My Teaching Schedule
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Weekly classroom schedule, assigned lecture halls, and class sections for Academic Year 2026-2027.
        </p>
      </div>

      <TimetableGrid
        slots={slots}
        title="Personalized Teaching Timetable"
        subtitle={`Total Scheduled Lecture Sessions: ${slots.length} Hours / Week`}
        showSectionBadge={true}
      />
    </div>
  );
}
