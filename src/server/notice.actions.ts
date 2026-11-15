"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNotices(userRole?: string) {
  const where: any = {};
  if (userRole && userRole !== "ADMIN") {
    where.targetRole = { in: ["ALL", userRole] };
  }

  return db.notice.findMany({
    where,
    orderBy: [
      { isPinned: "desc" },
      { createdAt: "desc" },
    ],
  });
}

export async function createNotice(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return;

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const category = (formData.get("category") as string) || "GENERAL";
  const targetRole = (formData.get("targetRole") as string) || "ALL";

  if (!title || !content) return;

  await db.notice.create({
    data: {
      title,
      content,
      category,
      targetRole,
      authorName: session.name || "Administration",
      isPinned: false,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/faculty");
  revalidatePath("/student");
}
