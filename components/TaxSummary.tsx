import { useMemo } from "react";
import { useWorkbookStore } from "@/store/useWorkbookStore";
import { formatNumber } from "@/lib/utils";
import { calculatePensionTax } from "@/lib/tax";

const formatPKR = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0
  }).format(value);

export const TaxSummary = () => {
  const computeTax = useWorkbookStore((state) => state.computeActiveClientTax);
  const client = useWorkbookStore((state) =>
    state.clients.find((item) => item.id === state.selectedClientId)
  );

  const result = computeTax();

  const pensionTax = useMemo(() => {
    if (!client || client.pensionIncome <= 10_000_000) return 0;
    return calculatePensionTax(client.pensionIncome).totalTax;
  }, [client]);

  if (!client || !result) return null;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Gross Income (`Tax_Calc`!D24)
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {formatPKR(result.grossIncome)}
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Taxable Income (`Tax_Calc`!D26)
        </p>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {formatPKR(result.taxableIncome)}
        </p>
        <p className="text-xs text-slate-500">
          Adjusted after deductions ({formatPKR(client.deductions)})
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Core Tax Payable (`Tax_Calc`!D32)
        </p>
        <p className="mt-2 text-2xl font-bold text-brand-700">
          {formatPKR(result.tax.totalTax)}
        </p>
        <p className="text-xs text-slate-500">
          Average Rate {formatNumber(result.tax.averageRate * 100, 2)}%
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-card">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Pension Tax (if applicable)
        </p>
        <p className="mt-2 text-2xl font-bold text-emerald-600">
          {pensionTax > 0 ? formatPKR(pensionTax) : "Exempt"}
        </p>
        <p className="text-xs text-slate-500">
          5% over ₨10M pension receipts
        </p>
      </div>
      <div className="md:col-span-4">
        <table className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left text-sm shadow-card">
          <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Tax Slab Reference</th>
              <th className="px-4 py-3">Taxable Portion (PKR)</th>
              <th className="px-4 py-3">Rate</th>
              <th className="px-4 py-3">Tax Allocated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {result.tax.breakdown.map((band) => (
              <tr key={band.slabLabel}>
                <td className="px-4 py-2 font-medium text-slate-700">
                  {band.slabLabel}
                </td>
                <td className="px-4 py-2 text-slate-600">
                  {formatPKR(band.taxablePortion)}
                </td>
                <td className="px-4 py-2 text-slate-600">
                  {formatNumber(band.rate * 100, 2)}%
                </td>
                <td className="px-4 py-2 font-semibold text-brand-700">
                  {formatPKR(band.computedTax)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxSummary;
