"use server";

import { db } from "@/lib/db";
import { setSessionCookie, deleteSessionCookie, getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  const user = await db.user.findUnique({
    where: { email },
    include: {
      student: true,
      faculty: true,
    },
  });

  if (!user) {
    return { error: "Invalid email or password." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return { error: "Invalid email or password." };
  }

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "ADMIN" | "FACULTY" | "STUDENT",
    studentProfileId: user.student?.id,
    facultyProfileId: user.faculty?.id,
    candidateCode: user.student?.candidateCode,
  });

  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "FACULTY") redirect("/faculty");
  redirect("/student");
}

export async function logoutAction() {
  await deleteSessionCookie();
  redirect("/login");
}

export async function getCurrentUser() {
  return getSession();
}
