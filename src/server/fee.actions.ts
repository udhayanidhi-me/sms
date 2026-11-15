"use server";

import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getInvoices(filters?: {
  status?: string;
  programId?: string;
  search?: string;
}) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const where: any = {};
  if (filters?.status && filters.status !== "ALL") where.status = filters.status;
  if (filters?.programId && filters.programId !== "ALL") {
    where.student = { programId: filters.programId };
  }
  if (filters?.search) {
    where.OR = [
      { invoiceNo: { contains: filters.search } },
      { student: { candidateCode: { contains: filters.search } } },
      { student: { user: { name: { contains: filters.search } } } },
    ];
  }

  return db.invoice.findMany({
    where,
    include: {
      student: {
        include: {
          user: { select: { name: true, email: true } },
          program: true,
        },
      },
      feeStructure: true,
      receipts: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function recordFeePayment(
  invoiceId: string,
  amount: number,
  paymentMethod: string,
  transactionRef?: string
) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return { error: "Only administrators can record fee collections." };
  }

  const invoice = await db.invoice.findUnique({
    where: { id: invoiceId },
  });
  if (!invoice) return { error: "Invoice not found." };

  const remaining = invoice.totalAmount - invoice.paidAmount;
  if (amount <= 0 || amount > remaining) {
    return { error: `Invalid payment amount. Balance remaining: ₹${remaining.toLocaleString("en-IN")}` };
  }

  const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  await db.$transaction(async (tx) => {
    // 1. Create Receipt
    await tx.paymentReceipt.create({
      data: {
        receiptNo,
        invoiceId,
        amount,
        paymentMethod,
        transactionRef: transactionRef || null,
      },
    });

    // 2. Update Invoice
    const newPaidAmount = invoice.paidAmount + amount;
    const newStatus = newPaidAmount >= invoice.totalAmount ? "PAID" : "PARTIAL";

    await tx.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
      },
    });
  });

  revalidatePath("/admin/fees");
  revalidatePath("/student");
  return { success: true, receiptNo };
}

export async function getStudentFees(studentId: string) {
  return db.invoice.findMany({
    where: { studentId },
    include: {
      feeStructure: true,
      receipts: {
        orderBy: { paidAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
