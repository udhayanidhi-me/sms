"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getAttendanceRegister(
  programId: string,
  semester: number,
  section: string,
  dateStr: string
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  // 1. Fetch all students in this program/semester/section
  const students = await db.studentProfile.findMany({
    where: {
      programId,
      semester,
      section,
      status: "ACTIVE",
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { candidateCode: "asc" },
  });

  // 2. Fetch existing attendance record if already marked for this date
  const existingRecord = await db.attendanceRecord.findFirst({
    where: {
      programId,
      semester,
      section,
      date: {
        gte: targetDate,
        lt: nextDay,
      },
    },
    include: {
      entries: true,
    },
  });

  const entryMap = new Map<string, string>();
  if (existingRecord) {
    existingRecord.entries.forEach((e) => {
      entryMap.set(e.studentId, e.status);
    });
  }

  const register = students.map((s) => ({
    studentId: s.id,
    candidateCode: s.candidateCode,
    name: s.user.name,
    status: entryMap.get(s.id) || "PRESENT", // default to PRESENT
  }));

  return {
    isMarked: !!existingRecord,
    recordId: existingRecord?.id,
    register,
  };
}

export async function saveAttendanceRegister(data: {
  programId: string;
  semester: number;
  section: string;
  dateStr: string;
  entries: { studentId: string; status: string; remarks?: string }[];
}) {
  const session = await getSession();
  if (!session || (session.role !== "FACULTY" && session.role !== "ADMIN")) {
    return { error: "Only faculty or administrators can record attendance." };
  }

  const targetDate = new Date(data.dateStr);
  targetDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  await db.$transaction(async (tx) => {
    // Check if record exists
    let record = await tx.attendanceRecord.findFirst({
      where: {
        programId: data.programId,
        semester: data.semester,
        section: data.section,
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      },
    });

    if (!record) {
      record = await tx.attendanceRecord.create({
        data: {
          programId: data.programId,
          semester: data.semester,
          section: data.section,
          date: targetDate,
          period: 1,
          recordedBy: session.name,
        },
      });
    }

    // Delete existing entries for this record and re-insert
    await tx.attendanceEntry.deleteMany({
      where: { attendanceRecordId: record.id },
    });

    await tx.attendanceEntry.createMany({
      data: data.entries.map((e) => ({
        attendanceRecordId: record!.id,
        studentId: e.studentId,
        status: e.status,
        remarks: e.remarks || null,
      })),
    });
  });

  revalidatePath("/faculty/attendance");
  revalidatePath("/student");
  return { success: true };
}

export async function getStudentAttendanceSummary(studentId: string) {
  const entries = await db.attendanceEntry.findMany({
    where: { studentId },
    include: {
      record: true,
    },
    orderBy: {
      record: { date: "desc" },
    },
  });

  const totalClasses = entries.length;
  const attendedClasses = entries.filter((e) => e.status === "PRESENT").length;
  const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;
  const isShortage = percentage < 75;

  return {
    totalClasses,
    attendedClasses,
    absentClasses: totalClasses - attendedClasses,
    percentage,
    isShortage,
    recentEntries: entries.slice(0, 10).map((e) => ({
      id: e.id,
      date: e.record.date.toISOString().split("T")[0],
      status: e.status,
      recordedBy: e.record.recordedBy,
    })),
  };
}
