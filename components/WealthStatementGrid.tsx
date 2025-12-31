import { ChangeEvent } from "react";
import { useWorkbookStore, WealthRow } from "@/store/useWorkbookStore";
import { formatNumber, sumBy } from "@/lib/utils";
import { motion } from "framer-motion";

const heads: WealthRow["head"][] = ["Assets", "Liabilities", "Equity"];

const formatPKR = (value: number) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0
  }).format(value);

const ColumnHeader = ({ label, reference }: { label: string; reference: string }) => (
  <div className="flex flex-col">
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </span>
    <span className="text-[11px] text-slate-400">{reference}</span>
  </div>
);

export const WealthStatementGrid = () => {
  const rows = useWorkbookStore((state) => state.wealthStatement);
  const upsertRow = useWorkbookStore((state) => state.upsertWealthRow);
  const removeRow = useWorkbookStore((state) => state.removeWealthRow);

  const onValueChange = (
    row: WealthRow,
    field: keyof WealthRow,
    value: string | number
  ) => {
    const numericFields: (keyof WealthRow)[] = [
      "openingBalance",
      "additions",
      "disposals",
      "closingBalance"
    ];
    const payload = numericFields.includes(field)
      ? Number(value || 0)
      : value;
    const updated: Partial<WealthRow> = { [field]: payload } as Partial<WealthRow>;

    if (numericFields.includes(field)) {
      const opening =
        field === "openingBalance" ? Number(value || 0) : row.openingBalance;
      const additions =
        field === "additions" ? Number(value || 0) : row.additions;
      const disposals =
        field === "disposals" ? Number(value || 0) : row.disposals;
      if (field !== "closingBalance") {
        updated.closingBalance = opening + additions - disposals;
      }
    }

    upsertRow({ ...row, ...updated });
  };

  return (
    <div className="space-y-6">
      {heads.map((head) => {
        const filtered = rows.filter((row) => row.head === head);
        const totals = {
          opening: sumBy(filtered, (row) => row.openingBalance),
          additions: sumBy(filtered, (row) => row.additions),
          disposals: sumBy(filtered, (row) => row.disposals),
          closing: sumBy(filtered, (row) => row.closingBalance)
        };
        return (
          <motion.div
            key={head}
            layout
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-5 py-3">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                  {head} Register (Sheet `Wealth`!Columns B:H)
                </h3>
                <p className="text-xs text-slate-500">
                  Maintain granular entries for reconciliation statement
                </p>
              </div>
              <button
                onClick={() =>
                  upsertRow({
                    head,
                    subHead: "New Head",
                    description: "Describe asset/liability",
                    openingBalance: 0,
                    additions: 0,
                    disposals: 0,
                    closingBalance: 0
                  })
                }
                className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-brand-700"
              >
                + Insert Row
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] table-fixed text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">
                      <ColumnHeader label="Sub Head" reference="Col B" />
                    </th>
                    <th className="px-4 py-3">
                      <ColumnHeader label="Description" reference="Col C" />
                    </th>
                    <th className="px-4 py-3">
                      <ColumnHeader label="Opening Balance" reference="Col D" />
                    </th>
                    <th className="px-4 py-3">
                      <ColumnHeader label="Additions" reference="Col E" />
                    </th>
                    <th className="px-4 py-3">
                      <ColumnHeader label="Disposals" reference="Col F" />
                    </th>
                    <th className="px-4 py-3">
                      <ColumnHeader label="Closing Balance" reference="Col G" />
                    </th>
                    <th className="px-4 py-3">
                      <ColumnHeader label="Remarks" reference="Col H" />
                    </th>
                    <th className="px-4 py-3 text-right">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Action
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filtered.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-2">
                        <input
                          value={row.subHead}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            onValueChange(row, "subHead", event.target.value)
                          }
                          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-slate-700 focus:border-brand-300 focus:bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={row.description}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            onValueChange(row, "description", event.target.value)
                          }
                          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-slate-700 focus:border-brand-300 focus:bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={row.openingBalance}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            onValueChange(row, "openingBalance", event.target.value)
                          }
                          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-right text-sm text-slate-700 focus:border-brand-300 focus:bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={row.additions}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            onValueChange(row, "additions", event.target.value)
                          }
                          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-right text-sm text-slate-700 focus:border-brand-300 focus:bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={row.disposals}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            onValueChange(row, "disposals", event.target.value)
                          }
                          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-right text-sm text-slate-700 focus:border-brand-300 focus:bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={row.closingBalance}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            onValueChange(row, "closingBalance", event.target.value)
                          }
                          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-right text-sm text-slate-700 focus:border-brand-300 focus:bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={row.remarks ?? ""}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            onValueChange(row, "remarks", event.target.value)
                          }
                          className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-slate-700 focus:border-brand-300 focus:bg-white focus:outline-none"
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
                      Section Totals
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatPKR(totals.opening)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatPKR(totals.additions)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatPKR(totals.disposals)}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {formatPKR(totals.closing)}
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

export default WealthStatementGrid;
