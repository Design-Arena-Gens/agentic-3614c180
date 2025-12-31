import { useWorkbookStore } from "@/store/useWorkbookStore";

export const MacroActivityLog = () => {
  const log = useWorkbookStore((state) => state.macroLog);

  if (log.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500 shadow-card">
        Macro activity will appear here after you copy or execute automation
        scripts.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-200 bg-slate-100 px-5 py-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">
          Macro Activity Monitor
        </p>
      </div>
      <ul className="divide-y divide-slate-100">
        {log.map((entry) => (
          <li key={entry.id} className="px-5 py-3 text-sm text-slate-700">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{new Date(entry.timestamp).toLocaleString()}</span>
              <span>{entry.action}</span>
            </div>
            <p className="mt-1 text-slate-600">{entry.details}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MacroActivityLog;
