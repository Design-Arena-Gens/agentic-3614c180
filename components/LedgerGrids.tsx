import { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { useWorkbookStore, LedgerRow } from "@/store/useWorkbookStore";
import { formatNumber } from "@/lib/utils";

const sheetNames: LedgerRow["sheet"][] = ["Trading", "Manufacturing", "ProfitAndLoss"];

const sheetMetadata: Record<LedgerRow["sheet"], { title: string; reference: string }> = {
  Trading: { title: "Trading Account", reference: "`Trading_Account`!B:G" },
  Manufacturing: { title: "Manufacturing Account", reference: "`Manufacturing`!B:G" },
  ProfitAndLoss: { title: "Profit & Loss Account", reference: "`Profit_Loss`!B:H" }
};

export const LedgerGrids = () => {
  const rows = useWorkbookStore((state) => state.ledgers);
  const upsertRow = useWorkbookStore((state) => state.upsertLedgerRow);
  const removeRow = useWorkbookStore((state) => state.removeLedgerRow);

  const handleChange = (
    row: LedgerRow,
    field: keyof LedgerRow,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value =
      field === "debit" || field === "credit"
        ? Number(event.target.value || 0)
        : event.target.value;
    upsertRow({ ...row, [field]: value });
  };

  return (
    <div className="space-y-6">
      {sheetNames.map((sheet) => {
        const filtered = rows.filter((row) => row.sheet === sheet);
        const totals = filtered.reduce(
          (acc, row) => {
            acc.debit += row.debit;
            acc.credit += row.credit;
            return acc;
          },
          { debit: 0, credit: 0 }
        );
        return (
          <motion.div
            key={sheet}
            layout
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-5 py-3">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                  {sheetMetadata[sheet].title} ({sheetMetadata[sheet].reference})
                </h3>
                <p className="text-xs text-slate-500">
                  Map each entry to trial balance and reconciliation worksheet
                </p>
              </div>
              <button
                onClick={() =>
                  upsertRow({
                    sheet,
                    accountHead: "New Account Head",
                    particulars: "Detail your narration",
                    debit: 0,
                    credit: 0
                  })
                }
                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                + Add Ledger Row
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Account Head (Col B)</th>
                    <th className="px-4 py-3">Particulars / Narration (Col C)</th>
                    <th className="px-4 py-3 text-right">Debit (Col D)</th>
                    <th className="px-4 py-3 text-right">Credit (Col E)</th>
                    <th className="px-4 py-3">Notes (Col F/G)</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2">
                        <input
                          value={row.accountHead}
                          onChange={(event) => handleChange(row, "accountHead", event)}
                          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-slate-700 focus:border-emerald-300 focus:bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={row.particulars}
                          onChange={(event) => handleChange(row, "particulars", event)}
                          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-slate-700 focus:border-emerald-300 focus:bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <input
                          type="number"
                          value={row.debit}
                          onChange={(event) => handleChange(row, "debit", event)}
                          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-right text-sm text-slate-700 focus:border-emerald-300 focus:bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <input
                          type="number"
                          value={row.credit}
                          onChange={(event) => handleChange(row, "credit", event)}
                          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-right text-sm text-slate-700 focus:border-emerald-300 focus:bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={row.notes ?? ""}
                          onChange={(event) => handleChange(row, "notes", event)}
                          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-slate-700 focus:border-emerald-300 focus:bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => removeRow(row.id)}
                          className="text-xs font-semibold text-rose-500 transition hover:text-rose-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 text-sm font-semibold text-slate-700">
                  <tr>
                    <td className="px-4 py-2" colSpan={2}>
                      Totals
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatNumber(totals.debit)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatNumber(totals.credit)}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LedgerGrids;
