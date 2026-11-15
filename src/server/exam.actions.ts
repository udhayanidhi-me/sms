"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { calculateKeralaGrade } from "@/lib/grading";

export async function getExams(programId?: string) {
  const where: any = {};
  if (programId && programId !== "ALL") where.programId = programId;

  return db.exam.findMany({
    where,
    include: {
      program: true,
      _count: { select: { results: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getExamCourses(examId: string) {
  const exam = await db.exam.findUnique({
    where: { id: examId },
    include: {
      program: {
        include: {
          courses: true,
        },
      },
    },
  });
  if (!exam) return [];
  return exam.program.courses.filter((c) => c.semester === exam.semester);
}

export async function getExamMarkSheet(examId: string, courseId: string) {
  const exam = await db.exam.findUnique({
    where: { id: examId },
    include: { program: true },
  });
  if (!exam) throw new Error("Exam not found");

  const course = await db.course.findUnique({
    where: { id: courseId },
  });
  if (!course) throw new Error("Course not found");

  // Fetch enrolled students
  const students = await db.studentProfile.findMany({
    where: {
      programId: exam.programId,
      semester: exam.semester,
      status: "ACTIVE",
    },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { candidateCode: "asc" },
  });

  // Fetch existing results
  const existingResults = await db.examResult.findMany({
    where: {
      examId,
      courseId,
    },
  });

  const resultMap = new Map<string, any>();
  existingResults.forEach((r) => {
    resultMap.set(r.studentId, r);
  });

  const marksList = students.map((s) => {
    const res = resultMap.get(s.id);
    return {
      studentId: s.id,
      candidateCode: s.candidateCode,
      name: s.user.name,
      caMark: res ? res.caMark : 0,
      esaMark: res ? res.esaMark : 0,
      totalMark: res ? res.totalMark : 0,
      grade: res ? res.grade : "-",
      status: res ? res.status : "-",
    };
  });

  return {
    exam,
    course,
    marksList,
  };
}

export async function saveExamMarks(
  examId: string,
  courseId: string,
  entries: { studentId: string; caMark: number; esaMark: number }[]
) {
  const session = await getSession();
  if (!session || (session.role !== "FACULTY" && session.role !== "ADMIN")) {
    return { error: "Only faculty or administrators can submit marks." };
  }

  await db.$transaction(async (tx) => {
    for (const entry of entries) {
      const total = Number((entry.caMark + entry.esaMark).toFixed(2));
      const { grade, gradePoint, status } = calculateKeralaGrade(total);

      await tx.examResult.upsert({
        where: {
          examId_studentId_courseId: {
            examId,
            studentId: entry.studentId,
            courseId,
          },
        },
        update: {
          caMark: entry.caMark,
          esaMark: entry.esaMark,
          totalMark: total,
          gradePoint,
          grade,
          status,
        },
        create: {
          examId,
          studentId: entry.studentId,
          courseId,
          caMark: entry.caMark,
          esaMark: entry.esaMark,
          totalMark: total,
          gradePoint,
          grade,
          status,
        },
      });
    }
  });

  revalidatePath("/faculty/marks");
  revalidatePath("/student");
  return { success: true };
}

export async function getStudentStatementOfMarks(studentId: string, examId?: string) {
  const student = await db.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      user: { select: { name: true, email: true } },
      program: true,
    },
  });

  if (!student) return null;

  // Find latest published exam or specific exam
  const exam = examId
    ? await db.exam.findUnique({ where: { id: examId } })
    : await db.exam.findFirst({
        where: { programId: student.programId, status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
      });

  if (!exam) return null;

  const results = await db.examResult.findMany({
    where: {
      examId: exam.id,
      studentId: student.id,
    },
    include: {
      course: true,
    },
  });

  let totalWeightedGP = 0;
  let totalCredits = 0;
  let hasFailedCourse = false;

  results.forEach((r) => {
    totalCredits += r.course.credits;
    totalWeightedGP += r.gradePoint * r.course.credits;
    if (r.status === "FAILED") hasFailedCourse = true;
  });

  const gpa = totalCredits > 0 ? Number((totalWeightedGP / totalCredits).toFixed(2)) : 0;
  const percentage = Number((gpa * 10).toFixed(2));

  return {
    student,
    exam,
    results,
    totalCredits,
    gpa,
    percentage,
    overallStatus: hasFailedCourse ? "FAILED" : "PASSED",
  };
}
