"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getAdminDashboardStats() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") throw new Error("Unauthorized");

  const [
    totalStudents,
    totalFaculty,
    totalPrograms,
    invoices,
    notices,
    recentStudents,
  ] = await Promise.all([
    db.studentProfile.count({ where: { status: "ACTIVE" } }),
    db.facultyProfile.count(),
    db.program.count(),
    db.invoice.findMany({
      select: { totalAmount: true, paidAmount: true, status: true },
    }),
    db.notice.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.studentProfile.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        program: { select: { name: true } },
      },
    }),
  ]);

  const totalFeeBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalFeeCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalFeePending = totalFeeBilled - totalFeeCollected;

  return {
    totalStudents,
    totalFaculty,
    totalPrograms,
    totalFeeBilled,
    totalFeeCollected,
    totalFeePending,
    recentStudents,
    recentNotices: notices,
  };
}

export async function getFacultyDashboardStats() {
  const session = await getSession();
  if (!session || (session.role !== "FACULTY" && session.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }

  const faculty = await db.facultyProfile.findUnique({
    where: { userId: session.userId },
    include: {
      user: true,
      allocations: {
        include: {
          course: {
            include: { program: true },
          },
        },
      },
    },
  });

  const notices = await db.notice.findMany({
    where: { targetRole: { in: ["ALL", "FACULTY"] } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return {
    faculty,
    allocations: faculty?.allocations || [],
    notices,
  };
}

export async function getStudentDashboardStats(studentId: string) {
  const student = await db.studentProfile.findUnique({
    where: { id: studentId },
    include: {
      user: true,
      program: true,
      attendance: true,
      invoices: true,
      examResults: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!student) return null;

  // Attendance stats
  const totalClasses = student.attendance.length;
  const attendedClasses = student.attendance.filter((a) => a.status === "PRESENT").length;
  const attendancePct = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;

  // Fees stats
  const totalFees = student.invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const paidFees = student.invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const pendingFees = totalFees - paidFees;

  // Academic stats
  let totalCredits = 0;
  let weightedGP = 0;
  student.examResults.forEach((r) => {
    totalCredits += r.course.credits;
    weightedGP += r.gradePoint * r.course.credits;
  });
  const gpa = totalCredits > 0 ? Number((weightedGP / totalCredits).toFixed(2)) : 0;

  const notices = await db.notice.findMany({
    where: { targetRole: { in: ["ALL", "STUDENT"] } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return {
    student,
    attendancePct,
    totalClasses,
    attendedClasses,
    pendingFees,
    gpa,
    examResults: student.examResults,
    notices,
  };
}
