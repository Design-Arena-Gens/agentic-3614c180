import { useMemo } from "react";
import { useWorkbookStore } from "@/store/useWorkbookStore";
import { motion } from "framer-motion";

const badgeColors: Record<string, string> = {
  Individual: "bg-brand-100 text-brand-800",
  Salaried: "bg-emerald-100 text-emerald-700",
  "Association of Persons": "bg-sky-100 text-sky-700",
  Business: "bg-violet-100 text-violet-700"
};

export const ClientSelector = () => {
  const {
    clients,
    selectedClientId,
    selectClient,
    addClient,
    updateClient
  } = useWorkbookStore((state) => ({
    clients: state.clients,
    selectedClientId: state.selectedClientId,
    selectClient: state.selectClient,
    addClient: state.addClient,
    updateClient: state.updateClient
  }));

  const selected = useMemo(
    () => clients.find((client) => client.id === selectedClientId),
    [clients, selectedClientId]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <motion.button
            key={client.id}
            onClick={() => selectClient(client.id)}
            layout
            whileHover={{ y: -2 }}
            className={`rounded-2xl border p-4 text-left transition-all ${
              client.id === selectedClientId
                ? "border-brand-400 bg-brand-50 shadow-card"
                : "border-slate-200 bg-white hover:border-brand-200"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{client.name}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Tax Year {client.taxYear}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  badgeColors[client.taxpayerCategory] ?? "bg-slate-100"
                }`}
              >
                {client.taxpayerCategory}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div>
                <dt className="uppercase tracking-wide">Residency</dt>
                <dd className="font-medium text-slate-800">
                  {client.residencyStatus}
                </dd>
              </div>
              <div>
                <dt className="uppercase tracking-wide">National ID</dt>
                <dd className="font-medium text-slate-800">
                  {client.nationalId}
                </dd>
              </div>
            </dl>
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.01 }}
          onClick={() =>
            addClient({
              name: `Client ${clients.length + 1}`,
              taxpayerCategory: "Individual"
            })
          }
          className="flex h-full min-h-[148px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white text-sm font-medium text-slate-500 transition hover:border-brand-300 hover:text-brand-600"
        >
          + Add New Client Workspace
        </motion.button>
      </div>

      {selected && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Business Income (Sheet `Tax_Calc`!D11)
            </label>
            <input
              type="number"
              value={selected.businessIncome}
              onChange={(event) =>
                updateClient(selected.id, {
                  businessIncome: Number(event.target.value ?? 0)
                })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="PKR"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Salary Income (Sheet `Tax_Calc`!D8)
            </label>
            <input
              type="number"
              value={selected.salaryIncome}
              onChange={(event) =>
                updateClient(selected.id, {
                  salaryIncome: Number(event.target.value ?? 0)
                })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="PKR"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Other Taxable Income (Sheet `Tax_Calc`!D14)
            </label>
            <input
              type="number"
              value={selected.otherTaxableIncome}
              onChange={(event) =>
                updateClient(selected.id, {
                  otherTaxableIncome: Number(event.target.value ?? 0)
                })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="PKR"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Allowable Deductions (Sheet `Tax_Calc`!D18)
            </label>
            <input
              type="number"
              value={selected.deductions}
              onChange={(event) =>
                updateClient(selected.id, {
                  deductions: Number(event.target.value ?? 0)
                })
              }
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
              placeholder="PKR"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSelector;
