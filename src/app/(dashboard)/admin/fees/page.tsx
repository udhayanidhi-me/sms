import { getInvoices, recordFeePayment } from "@/server/fee.actions";
import { CreditCard, CheckCircle2, Clock, AlertCircle, ArrowUpRight } from "lucide-react";

export default async function AdminFeesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const { status, search } = await searchParams;
  const invoices = await getInvoices({ status, search });

  async function handlePayment(formData: FormData) {
    "use server";
    const invoiceId = formData.get("invoiceId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const paymentMethod = formData.get("paymentMethod") as string;
    const transactionRef = formData.get("transactionRef") as string;
    await recordFeePayment(invoiceId, amount, paymentMethod, transactionRef);
  }

  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstanding = totalBilled - totalCollected;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Fee Accounts & Collections
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Track semester tuition, exam fees, and record payment collections with instant receipts.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase">Total Invoiced</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">
            ₹{totalBilled.toLocaleString("en-IN")}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{invoices.length} Registered Candidates</p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 uppercase">Total Realized</p>
          <h3 className="text-2xl font-bold text-emerald-700 mt-1">
            ₹{totalCollected.toLocaleString("en-IN")}
          </h3>
          <p className="text-xs text-emerald-600 mt-1">
            {totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0}% Collection Rate
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-amber-600 uppercase">Outstanding Dues</p>
          <h3 className="text-2xl font-bold text-amber-700 mt-1">
            ₹{totalOutstanding.toLocaleString("en-IN")}
          </h3>
          <p className="text-xs text-amber-600 mt-1">Pending Semester Clearance</p>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Institutional Invoices & Receipts</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filters:</span>
            <a
              href="/admin/fees"
              className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                !status ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All
            </a>
            <a
              href="/admin/fees?status=PENDING"
              className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                status === "PENDING"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Pending
            </a>
            <a
              href="/admin/fees?status=PAID"
              className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                status === "PAID"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Paid
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Invoice No</th>
                <th className="px-6 py-3">Candidate</th>
                <th className="px-6 py-3">Fee Particulars</th>
                <th className="px-6 py-3 text-right">Total Billed</th>
                <th className="px-6 py-3 text-right">Paid</th>
                <th className="px-6 py-3 text-right">Balance Due</th>
                <th className="px-6 py-3 text-center">Status</th>
                <th className="px-6 py-3 text-center">Record Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoices.map((inv) => {
                const balance = inv.totalAmount - inv.paidAmount;
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-900">
                      {inv.invoiceNo}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{inv.student.user.name}</div>
                      <div className="text-xs font-mono text-indigo-600">
                        Code: {inv.student.candidateCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-700">
                      {inv.feeStructure.title}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">
                      ₹{inv.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600">
                      ₹{inv.paidAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-amber-600">
                      {balance > 0 ? `₹${balance.toLocaleString("en-IN")}` : "₹0"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          inv.status === "PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : inv.status === "PARTIAL"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {balance > 0 ? (
                        <form action={handlePayment} className="inline-flex items-center gap-1.5">
                          <input type="hidden" name="invoiceId" value={inv.id} />
                          <input
                            type="number"
                            name="amount"
                            defaultValue={balance}
                            max={balance}
                            min={100}
                            step="any"
                            className="w-24 text-xs border border-slate-300 rounded px-2 py-1 text-slate-900"
                            title="Payment Amount"
                          />
                          <select
                            name="paymentMethod"
                            className="text-xs border border-slate-300 rounded px-1.5 py-1 text-slate-900"
                          >
                            <option value="UPI">UPI</option>
                            <option value="CASH">Cash</option>
                            <option value="BANK_TRANSFER">Bank</option>
                          </select>
                          <button
                            type="submit"
                            className="text-xs px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
                          >
                            Receive
                          </button>
                        </form>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Receipt Issued</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
