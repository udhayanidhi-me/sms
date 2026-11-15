"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getStudents(filters?: {
  programId?: string;
  semester?: number;
  search?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const where: any = {};
  if (filters?.programId && filters.programId !== "ALL") {
    where.programId = filters.programId;
  }
  if (filters?.semester && filters.semester !== 0) {
    where.semester = filters.semester;
  }
  if (filters?.search) {
    const s = filters.search.trim();
    where.OR = [
      { user: { name: { contains: s } } },
      { candidateCode: { contains: s } },
      { user: { email: { contains: s } } },
    ];
  }

  const students = await db.studentProfile.findMany({
    where,
    include: {
      user: {
        select: {
          name: true,
          email: true,
          avatar: true,
        },
      },
      program: true,
      invoices: {
        select: {
          totalAmount: true,
          paidAmount: true,
          status: true,
        },
      },
      attendance: {
        select: {
          status: true,
        },
      },
    },
    orderBy: { candidateCode: "asc" },
  });

  return students.map((s) => {
    const totalDays = s.attendance.length;
    const presentDays = s.attendance.filter((a) => a.status === "PRESENT").length;
    const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

    const totalFees = s.invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const paidFees = s.invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
    const pendingFees = totalFees - paidFees;

    return {
      ...s,
      attendancePercentage: attendancePct,
      pendingFees,
    };
  });
}

export async function createStudentAdmission(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return;

  const name = formData.get("name") as string;
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const programId = formData.get("programId") as string;
  const batch = formData.get("batch") as string;
  const semester = parseInt(formData.get("semester") as string) || 1;
  const section = (formData.get("section") as string) || "A";
  const candidateCode = formData.get("candidateCode") as string;
  const phone = formData.get("phone") as string;
  const gender = formData.get("gender") as string;
  const address = formData.get("address") as string;
  const guardianName = formData.get("guardianName") as string;
  const guardianPhone = formData.get("guardianPhone") as string;
  const password = (formData.get("password") as string) || "Password@123";

  if (!name || !email || !programId || !candidateCode) return;

  // Check unique candidateCode or email
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) return;

  const existingCode = await db.studentProfile.findUnique({ where: { candidateCode } });
  if (existingCode) return;

  const passwordHash = await bcrypt.hash(password, 10);

  await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "STUDENT",
      },
    });

    await tx.studentProfile.create({
      data: {
        userId: user.id,
        candidateCode,
        programId,
        batch: batch || "2026-2031",
        semester,
        sectionName: section,
        phone,
        gender,
        address,
        guardianName,
        guardianPhone,
      },
    });
  });

  revalidatePath("/admin/students");
}
