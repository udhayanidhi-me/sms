import { getSession } from "@/lib/auth";
import { getStudentFees } from "@/server/fee.actions";
import { redirect } from "next/navigation";
import { Receipt, CheckCircle2, Clock, CreditCard } from "lucide-react";

export default async function StudentFeesPage() {
  const session = await getSession();
  if (!session || !session.studentProfileId) {
    redirect("/login");
  }

  const invoices = await getStudentFees(session.studentProfileId);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Fee Invoices & Payment Receipts
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Review semester fee schedules, download payment receipts, and verify clearance status.
        </p>
      </div>

      <div className="space-y-6">
        {invoices.map((inv) => {
          const balance = inv.totalAmount - inv.paidAmount;
          return (
            <div
              key={inv.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Invoice Banner */}
              <div className="p-6 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {inv.invoiceNo}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        inv.status === "PAID"
                          ? "bg-emerald-100 text-emerald-800"
                          : inv.status === "PARTIAL"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {inv.feeStructure.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Due Date: {new Date(inv.dueDate).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Total Fee</div>
                  <div className="text-2xl font-bold text-slate-900">
                    ₹{inv.totalAmount.toLocaleString("en-IN")}
                  </div>
                  {balance > 0 ? (
                    <div className="text-xs font-bold text-amber-600 mt-0.5">
                      ₹{balance.toLocaleString("en-IN")} Due
                    </div>
                  ) : (
                    <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 justify-end mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Fully Cleared
                    </div>
                  )}
                </div>
              </div>

              {/* Fee Particulars */}
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 block font-medium">Tuition Fee</span>
                  <strong className="text-sm font-semibold text-slate-800">
                    ₹{inv.feeStructure.tuitionFee.toLocaleString("en-IN")}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Special Amenities</span>
                  <strong className="text-sm font-semibold text-slate-800">
                    ₹{inv.feeStructure.specialFee.toLocaleString("en-IN")}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Library & Digital Lab</span>
                  <strong className="text-sm font-semibold text-slate-800">
                    ₹{inv.feeStructure.libraryFee.toLocaleString("en-IN")}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">University Exam Fee</span>
                  <strong className="text-sm font-semibold text-slate-800">
                    ₹{inv.feeStructure.examFee.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              {/* Payment Receipts */}
              <div className="p-6 bg-white">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Issued Receipts & Transaction History
                </h4>
                {inv.receipts.length > 0 ? (
                  <div className="space-y-2">
                    {inv.receipts.map((rec) => (
                      <div
                        key={rec.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Receipt className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-mono font-bold text-slate-900">
                              {rec.receiptNo}
                            </span>
                            <div className="text-[11px] text-slate-500">
                              Method: {rec.paymentMethod} • Ref: {rec.transactionRef || "N/A"}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-emerald-700 text-sm">
                            ₹{rec.amount.toLocaleString("en-IN")}
                          </span>
                          <div className="text-[11px] text-slate-400">
                            {new Date(rec.paidAt).toLocaleDateString("en-IN")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No payments recorded yet.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
