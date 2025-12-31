import { ChangeEvent } from "react";
import { motion } from "framer-motion";
import { useWorkbookStore, ComplianceChecklistItem } from "@/store/useWorkbookStore";
import { todayIso } from "@/lib/utils";

const statusSwatches: Record<ComplianceChecklistItem["status"], string> = {
  Pending: "bg-amber-100 text-amber-700",
  Prepared: "bg-sky-100 text-sky-700",
  Reviewed: "bg-violet-100 text-violet-700",
  Filed: "bg-emerald-100 text-emerald-700"
};

export const ComplianceChecklist = () => {
  const checklist = useWorkbookStore((state) => state.complianceChecklist);
  const upsert = useWorkbookStore((state) => state.upsertChecklist);
  const remove = useWorkbookStore((state) => state.removeChecklist);

  const handleUpdate = (
    row: ComplianceChecklistItem,
    field: keyof ComplianceChecklistItem,
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    upsert({
      ...row,
      [field]: event.target.value
    });
  };

  return (
    <motion.div
      layout
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
    >
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-5 py-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Compliance & Filing Checklist (`Compliance`!B:H)
          </h3>
          <p className="text-xs text-slate-500">
            Monitor IRIS, withholding statements, reconciliations and annexures
          </p>
        </div>
        <button
          onClick={() =>
            upsert({
              title: "New Compliance Step",
              status: "Pending",
              owner: "Unassigned",
              reference: "Cell Ref",
              dueDate: todayIso()
            })
          }
          className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700"
        >
          + Add Checklist Row
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Control Point (Col B)</th>
              <th className="px-4 py-3">Status (Col C)</th>
              <th className="px-4 py-3">Owner (Col D)</th>
              <th className="px-4 py-3">Sheet Reference (Col E)</th>
              <th className="px-4 py-3">Due Date (Col F)</th>
              <th className="px-4 py-3">Remarks (Col G)</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {checklist.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-2">
                  <input
                    value={row.title}
                    onChange={(event) => handleUpdate(row, "title", event)}
                    className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-slate-700 focus:border-violet-300 focus:bg-white focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-2 w-2 rounded-full ${
                        row.status === "Pending"
                          ? "bg-amber-500"
                          : row.status === "Prepared"
                            ? "bg-sky-500"
                            : row.status === "Reviewed"
                              ? "bg-violet-500"
                              : "bg-emerald-500"
                      }`}
                    />
                    <select
                      value={row.status}
                      onChange={(event) =>
                        handleUpdate(row, "status", event)
                      }
                      className={`rounded-full px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-200 ${statusSwatches[row.status]}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Prepared">Prepared</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Filed">Filed</option>
                    </select>
                  </div>
                </td>
                <td className="px-4 py-2">
                  <input
                    value={row.owner}
                    onChange={(event) => handleUpdate(row, "owner", event)}
                    className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-slate-700 focus:border-violet-300 focus:bg-white focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    value={row.reference}
                    onChange={(event) => handleUpdate(row, "reference", event)}
                    className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-slate-700 focus:border-violet-300 focus:bg-white focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="date"
                    value={row.dueDate}
                    onChange={(event) => handleUpdate(row, "dueDate", event)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 focus:border-violet-300 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    value={row.remarks ?? ""}
                    onChange={(event) => handleUpdate(row, "remarks", event)}
                    className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-slate-700 focus:border-violet-300 focus:bg-white focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => remove(row.id)}
                    className="text-xs font-semibold text-rose-500 transition hover:text-rose-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ComplianceChecklist;
