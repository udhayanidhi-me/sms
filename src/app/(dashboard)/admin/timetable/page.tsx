import { db } from "@/lib/db";
import { getSectionTimetable } from "@/server/timetable.actions";
import { TimetableGrid } from "@/components/TimetableGrid";
import { ScheduleSlotForm } from "./ScheduleSlotForm";
import { Calendar, Layers } from "lucide-react";

export default async function AdminTimetablePage({
  searchParams,
}: {
  searchParams: Promise<{ sectionId?: string }>;
}) {
  const { sectionId } = await searchParams;

  const [sections, courses, faculties, classrooms] = await Promise.all([
    db.section.findMany({
      include: {
        program: true,
        classTutor: { include: { user: true } },
      },
      orderBy: [
        { program: { code: "asc" } },
        { semester: "asc" },
        { name: "asc" },
      ],
    }),
    db.course.findMany({
      orderBy: { code: "asc" },
    }),
    db.facultyProfile.findMany({
      include: { user: true },
      orderBy: { user: { name: "asc" } },
    }),
    db.classroom.findMany({
      orderBy: { code: "asc" },
    }),
  ]);

  const activeSection = sections.find((s) => s.id === sectionId) || sections[0];
  const slots = activeSection ? await getSectionTimetable(activeSection.id) : [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Institutional Master Timetable
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Weekly class routines, physical classroom allocation, and automated schedule conflict prevention.
          </p>
        </div>
      </div>

      {/* Section Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-slate-500 uppercase shrink-0">Class Sections:</span>
        {sections.map((sec) => (
          <a
            key={sec.id}
            href={`/admin/timetable?sectionId=${sec.id}`}
            className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              sec.id === activeSection?.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {sec.program.code} Sem {sec.semester}-{sec.name}
            {sec.classTutor && ` (Tutor: ${sec.classTutor.user.name.split(" ")[0]})`}
          </a>
        ))}
      </div>

      {/* Master Grid for active section */}
      {activeSection && (
        <TimetableGrid
          slots={slots}
          title={`${activeSection.program.name} • Semester ${activeSection.semester} (Section ${activeSection.name})`}
          subtitle={`Class Tutor: ${activeSection.classTutor?.user.name || "Unassigned"} • Batch ${activeSection.batch}`}
        />
      )}

      {/* Add Slot Form */}
      {activeSection && (
        <ScheduleSlotForm
          defaultSectionId={activeSection.id}
          sections={sections.map((s) => ({
            id: s.id,
            label: `${s.program.code} Sem ${s.semester}-${s.name}`,
          }))}
          courses={courses.map((c) => ({
            id: c.id,
            label: `${c.code}: ${c.name}`,
          }))}
          faculties={faculties.map((f) => ({
            id: f.id,
            label: `${f.user.name} (${f.designation.split("&")[0]})`,
          }))}
          classrooms={classrooms.map((r) => ({
            id: r.id,
            label: `${r.code} - ${r.name} (${r.capacity} Seats)`,
          }))}
        />
      )}
    </div>
  );
}
