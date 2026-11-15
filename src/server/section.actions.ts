"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getSectionsWithDetails() {
  return db.section.findMany({
    include: {
      program: true,
      classTutor: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
      defaultRoom: true,
      _count: {
        select: { students: true, timetableSlots: true },
      },
    },
    orderBy: [
      { program: { code: "asc" } },
      { semester: "asc" },
      { name: "asc" },
    ],
  });
}

export async function getClassrooms() {
  return db.classroom.findMany({
    orderBy: { code: "asc" },
  });
}

export async function getFacultyRoster() {
  return db.facultyProfile.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { user: { name: "asc" } },
  });
}

export async function getClassTutorMentorship(facultyId: string) {
  const sections = await db.section.findMany({
    where: { classTutorId: facultyId },
    include: {
      program: true,
      defaultRoom: true,
      students: {
        include: {
          user: { select: { name: true, email: true } },
          attendance: true,
          invoices: true,
        },
        orderBy: { candidateCode: "asc" },
      },
    },
  });

  return sections.map((sec) => {
    const studentsWithMetrics = sec.students.map((s) => {
      const totalDays = s.attendance.length;
      const presentDays = s.attendance.filter((a) => a.status === "PRESENT").length;
      const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;
      const isShortage = attendancePct < 75;

      const totalFees = s.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
      const paidFees = s.invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
      const pendingFees = totalFees - paidFees;

      return {
        ...s,
        attendancePercentage: attendancePct,
        isShortage,
        pendingFees,
      };
    });

    return {
      ...sec,
      students: studentsWithMetrics,
    };
  });
}
