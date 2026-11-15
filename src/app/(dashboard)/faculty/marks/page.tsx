import { db } from "@/lib/db";
import { getExamMarkSheet } from "@/server/exam.actions";
import { MarksEntryClient } from "./MarksEntryClient";

export default async function FacultyMarksPage({
  searchParams,
}: {
  searchParams: Promise<{ examId?: string; courseId?: string }>;
}) {
  const params = await searchParams;
  const exams = await db.exam.findMany({
    orderBy: { createdAt: "desc" },
  });

  const activeExam = exams.find((e) => e.id === params.examId) || exams[0];
  const courses = await db.course.findMany({
    where: {
      programId: activeExam?.programId,
      semester: activeExam?.semester,
    },
    orderBy: { code: "asc" },
  });

  const activeCourse = courses.find((c) => c.id === params.courseId) || courses[0];

  const markSheetData = activeExam && activeCourse
    ? await getExamMarkSheet(activeExam.id, activeCourse.id)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Continuous Assessment & Mark Evaluation
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            University of Kerala Examination Assessment System (CA & ESA Mark Entry).
          </p>
        </div>

        {/* Paper Switcher */}
        {courses.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Select Paper:</span>
            <div className="flex flex-wrap gap-1.5">
              {courses.map((c) => (
                <a
                  key={c.id}
                  href={`/faculty/marks?examId=${activeExam?.id}&courseId=${c.id}`}
                  className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold transition-colors ${
                    c.id === activeCourse?.id
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {c.code}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {markSheetData ? (
        <MarksEntryClient
          examId={activeExam.id}
          courseId={activeCourse.id}
          courseCode={activeCourse.code}
          courseName={activeCourse.name}
          caMax={activeCourse.caMaxMarks}
          esaMax={activeCourse.esaMaxMarks}
          initialMarks={markSheetData.marksList}
        />
      ) : (
        <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-500">
          No courses or active examinations found for evaluation.
        </div>
      )}
    </div>
  );
}
