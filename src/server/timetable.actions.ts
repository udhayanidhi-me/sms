"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getSectionTimetable(sectionId: string, academicYear = "2026-2027") {
  return db.timetableSlot.findMany({
    where: { sectionId, academicYear },
    include: {
      course: true,
      faculty: {
        include: {
          user: { select: { name: true } },
        },
      },
      classroom: true,
    },
    orderBy: [
      { dayOfWeek: "asc" },
      { period: "asc" },
    ],
  });
}

export async function getFacultyTimetable(facultyId: string, academicYear = "2026-2027") {
  return db.timetableSlot.findMany({
    where: { facultyId, academicYear },
    include: {
      course: true,
      faculty: {
        include: {
          user: { select: { name: true } },
        },
      },
      section: {
        include: {
          program: true,
        },
      },
      classroom: true,
    },
    orderBy: [
      { dayOfWeek: "asc" },
      { period: "asc" },
    ],
  });
}

export async function getFacultyWorkloadSummary(academicYear = "2026-2027") {
  const faculties = await db.facultyProfile.findMany({
    include: {
      user: { select: { name: true, email: true } },
      department: true,
      allocations: {
        where: { academicYear },
        include: { course: true },
      },
      timetableSlots: {
        where: { academicYear },
        include: {
          course: true,
          section: { include: { program: true } },
        },
      },
      mentoredSections: {
        include: { program: true },
      },
    },
    orderBy: [
      { roleTitle: "asc" },
      { user: { name: "asc" } },
    ],
  });

  return faculties.map((f) => {
    const weeklyHours = f.timetableSlots.length; // 1 period = 1 teaching hour
    const compliancePercentage = Math.round((weeklyHours / f.maxWeeklyHours) * 100);
    return {
      id: f.id,
      name: f.user.name,
      email: f.user.email,
      employeeCode: f.employeeCode,
      roleTitle: f.roleTitle,
      designation: f.designation,
      departmentName: f.departmentName,
      maxWeeklyHours: f.maxWeeklyHours,
      assignedPapers: f.allocations.map((a) => a.course.code),
      weeklyHours,
      compliancePercentage,
      mentoredSections: f.mentoredSections.map((s) => `${s.program.code} Sem ${s.semester}-${s.name}`),
    };
  });
}

export async function createTimetableSlot(payload: {
  dayOfWeek: number;
  period: number;
  startTime: string;
  endTime: string;
  sectionId: string;
  courseId: string;
  facultyId: string;
  classroomId: string;
  academicYear?: string;
}) {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "FACULTY")) {
    return { error: "Unauthorized" };
  }

  const academicYear = payload.academicYear || "2026-2027";

  // 1. Check Faculty Conflict
  const facultyClash = await db.timetableSlot.findFirst({
    where: {
      facultyId: payload.facultyId,
      dayOfWeek: payload.dayOfWeek,
      period: payload.period,
      academicYear,
    },
    include: {
      faculty: { include: { user: true } },
      course: true,
      classroom: true,
    },
  });

  if (facultyClash) {
    return {
      error: `Faculty Clash: ${facultyClash.faculty.user.name} is already scheduled for ${facultyClash.course.code} in ${facultyClash.classroom.code} during this period.`,
    };
  }

  // 2. Check Classroom Conflict
  const roomClash = await db.timetableSlot.findFirst({
    where: {
      classroomId: payload.classroomId,
      dayOfWeek: payload.dayOfWeek,
      period: payload.period,
      academicYear,
    },
    include: {
      classroom: true,
      section: { include: { program: true } },
      course: true,
    },
  });

  if (roomClash) {
    return {
      error: `Classroom Clash: ${roomClash.classroom.name} is already occupied by ${roomClash.section.program.code} Sem ${roomClash.section.semester}-${roomClash.section.name} for ${roomClash.course.code}.`,
    };
  }

  // 3. Check Section Conflict
  const sectionClash = await db.timetableSlot.findFirst({
    where: {
      sectionId: payload.sectionId,
      dayOfWeek: payload.dayOfWeek,
      period: payload.period,
      academicYear,
    },
    include: {
      course: true,
      faculty: { include: { user: true } },
    },
  });

  if (sectionClash) {
    return {
      error: `Section Clash: This section already has a lecture scheduled for ${sectionClash.course.name} with ${sectionClash.faculty.user.name}.`,
    };
  }

  // Save Slot
  await db.timetableSlot.create({
    data: {
      dayOfWeek: payload.dayOfWeek,
      period: payload.period,
      startTime: payload.startTime,
      endTime: payload.endTime,
      sectionId: payload.sectionId,
      courseId: payload.courseId,
      facultyId: payload.facultyId,
      classroomId: payload.classroomId,
      academicYear,
    },
  });

  revalidatePath("/admin/timetable");
  revalidatePath("/faculty/timetable");
  revalidatePath("/student/timetable");
  return { success: true };
}
