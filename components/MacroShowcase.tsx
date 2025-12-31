import { useState } from "react";
import { useWorkbookStore } from "@/store/useWorkbookStore";
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const macroBlocks = [
  {
    name: "Prepare_Tax_File",
    caption: "Refreshes calculations, validates entries and snapshots working papers.",
    code: `Sub Prepare_Tax_File()
    Application.ScreenUpdating = False
    Call Backup_Current_Version
    Worksheets("Tax_Calc").Calculate
    Worksheets("Wealth").Calculate
    Worksheets("Profit_Loss").Calculate
    Worksheets("Compliance").Calculate
    Call Highlight_Pending_Compliance
    Range("Dashboard!B6").Value = Now
    Application.ScreenUpdating = True
    MsgBox "Tax file reviewed and ready.", vbInformation
End Sub`
  },
  {
    name: "Build_Wealth_Summary",
    caption: "Consolidates wealth statement head counts and prepares reconciliation matrix.",
    code: `Sub Build_Wealth_Summary()
    Dim src As Worksheet, dest As Worksheet
    Dim nextRow As Long, assetTotal As Double, liabilityTotal As Double
    Set src = Worksheets("Wealth")
    Set dest = Worksheets("Reconciliation")
    dest.Range("B8:H200").ClearContents
    nextRow = 8
    assetTotal = WorksheetFunction.SumIf(src.Range("B:B"), "Assets", src.Range("G:G"))
    liabilityTotal = WorksheetFunction.SumIf(src.Range("B:B"), "Liabilities", src.Range("G:G"))
    dest.Range("C4").Value = assetTotal
    dest.Range("C5").Value = liabilityTotal
    dest.Range("C6").Value = assetTotal - liabilityTotal
    Call TransferRows(src, dest, nextRow)
    MsgBox "Wealth summary refreshed.", vbInformation
End Sub`
  },
  {
    name: "Create_IRIS_XML",
    caption: "Exports IRIS compliant XML package mapped from the workbook tables.",
    code: `Sub Create_IRIS_XML()
    Dim exportPath As String
    exportPath = Worksheets("Navigation").Range("C12").Value
    If Dir(exportPath, vbDirectory) = "" Then MkDir exportPath
    Call GenerateReturnXML(exportPath)
    Call ExportWealthXML(exportPath)
    Call ExportBalancesXML(exportPath)
    MsgBox "IRIS submission set created at " & exportPath, vbInformation
End Sub`
  },
  {
    name: "Highlight_Pending_Compliance",
    caption: "Flags outstanding compliance checks and updates dashboard counters.",
    code: `Sub Highlight_Pending_Compliance()
    Dim rng As Range, cell As Range, pendingCount As Long
    Set rng = Worksheets("Compliance").Range("C6:C24")
    pendingCount = 0
    For Each cell In rng
        cell.Offset(0, 4).Interior.ColorIndex = 0
        If UCase(cell.Value) = "PENDING" Then
            cell.Offset(0, 4).Interior.Color = RGB(255, 235, 156)
            pendingCount = pendingCount + 1
        End If
    Next cell
    Worksheets("Dashboard").Range("F12").Value = pendingCount
End Sub`
  }
];

export const MacroShowcase = () => {
  const appendLog = useWorkbookStore((state) => state.appendMacroLog);
  const [copiedMacro, setCopiedMacro] = useState<string | null>(null);

  const handleCopy = async (name: string, code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedMacro(name);
    appendLog({
      action: `Copied macro ${name}`,
      details: "Macro copied for workbook embedding"
    });
    setTimeout(() => setCopiedMacro(null), 2500);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {macroBlocks.map((macro) => (
        <motion.div
          key={macro.name}
          layout
          className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-50 shadow-card"
        >
          <div className="flex items-center justify-between rounded-t-2xl bg-slate-800 px-5 py-3">
            <div>
              <h3 className="text-sm font-semibold text-white">
                {macro.name}
              </h3>
              <p className="text-xs text-slate-300">{macro.caption}</p>
            </div>
            <button
              onClick={() => handleCopy(macro.name, macro.code)}
              className="flex items-center gap-2 rounded-full border border-slate-600 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-brand-400 hover:text-brand-200"
            >
              {copiedMacro === macro.name ? (
                <>
                  <ClipboardDocumentCheckIcon className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  Copy VBA
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap px-5 py-4 text-sm leading-relaxed text-emerald-200">
            <code>{macro.code}</code>
          </pre>
        </motion.div>
      ))}
    </div>
  );
};

export default MacroShowcase;
