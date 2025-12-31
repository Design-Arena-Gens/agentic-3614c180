import * as XLSX from "xlsx";
import { useWorkbookStore } from "@/store/useWorkbookStore";
import { useState } from "react";
import { ArrowDownTrayIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const headers = {
  clientProfile: [
    ["Field", "Value", "Notes / IRIS Mapping"],
    ["Client Name", "", "CNIC data flows to IRIS 114(1)"],
    ["Taxpayer Category", "", "Select between Individual / Salaried / AOP"],
    ["Residency Status", "", "Resident / Non-Resident toggle"],
    ["Professional Firm", "", "Set to Yes if subject to 40% cap"],
    ["Tax Year", "", "Auto-populated from Dashboard selection"],
    ["Filer Status", "", "Filer / Non-Filer affects withholding rates"],
    ["National ID", "", "CNIC / NTN format 00000-0000000-0"]
  ],
  macroInstructions: [
    ["Macro Name", "Purpose", "Ribbon Button Location"],
    ["Prepare_Tax_File", "Refresh calculations and validate compliance", "Navigation!A4"],
    ["Build_Wealth_Summary", "Summaries wealth statement into reconciliation", "Navigation!A6"],
    ["Create_IRIS_XML", "Exports XML package for e-filing", "Navigation!A8"],
    ["Highlight_Pending_Compliance", "Flags outstanding checklist items", "Navigation!A10"],
    ["Backup_Current_Version", "Archives current workbook version with timestamp", "Navigation!A12"]
  ]
};

export const WorkbookExporter = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const selectedClient = useWorkbookStore((state) =>
    state.clients.find((client) => client.id === state.selectedClientId)
  );
  const wealth = useWorkbookStore((state) => state.wealthStatement);
  const ledgers = useWorkbookStore((state) => state.ledgers);
  const checklist = useWorkbookStore((state) => state.complianceChecklist);

  const handleExport = async () => {
    if (!selectedClient) return;
    setIsGenerating(true);

    try {
      const wb = XLSX.utils.book_new();

      const profileSheet = XLSX.utils.aoa_to_sheet(headers.clientProfile);
      profileSheet["B2"] = { t: "s", v: selectedClient.name };
      profileSheet["B3"] = { t: "s", v: selectedClient.taxpayerCategory };
      profileSheet["B4"] = { t: "s", v: selectedClient.residencyStatus };
      profileSheet["B5"] = { t: "s", v: selectedClient.professionalFirm ? "Yes" : "No" };
      profileSheet["B6"] = { t: "n", v: selectedClient.taxYear };
      profileSheet["B7"] = { t: "s", v: selectedClient.filerStatus };
      profileSheet["B8"] = { t: "s", v: selectedClient.nationalId };
      XLSX.utils.book_append_sheet(wb, profileSheet, "Client_Profile");

      const taxCalcData = [
        ["Description", "Reference", "Amount (PKR)"],
        ["Salary Income", "Tax_Calc!D8", selectedClient.salaryIncome],
        ["Business Income", "Tax_Calc!D11", selectedClient.businessIncome],
        ["Other Taxable Income", "Tax_Calc!D14", selectedClient.otherTaxableIncome],
        ["Allowable Deductions", "Tax_Calc!D18", selectedClient.deductions],
        ["Net Taxable Income", "Tax_Calc!D26", selectedClient.salaryIncome + selectedClient.businessIncome + selectedClient.otherTaxableIncome - selectedClient.deductions],
        ["Pension Income", "Tax_Calc!D16", selectedClient.pensionIncome]
      ];
      const taxCalcSheet = XLSX.utils.aoa_to_sheet(taxCalcData);
      XLSX.utils.book_append_sheet(wb, taxCalcSheet, "Tax_Calc");

      const wealthData = [
        ["Head", "Sub Head", "Description", "Opening Balance", "Additions", "Disposals", "Closing Balance", "Remarks"],
        ...wealth.map((row) => [
          row.head,
          row.subHead,
          row.description,
          row.openingBalance,
          row.additions,
          row.disposals,
          row.closingBalance,
          row.remarks ?? ""
        ])
      ];
      const wealthSheet = XLSX.utils.aoa_to_sheet(wealthData);
      XLSX.utils.book_append_sheet(wb, wealthSheet, "Wealth");

      const ledgerSheetData = [
        ["Sheet", "Account Head", "Particulars", "Debit", "Credit", "Notes"],
        ...ledgers.map((row) => [
          row.sheet,
          row.accountHead,
          row.particulars,
          row.debit,
          row.credit,
          row.notes ?? ""
        ])
      ];
      const ledgerSheet = XLSX.utils.aoa_to_sheet(ledgerSheetData);
      XLSX.utils.book_append_sheet(wb, ledgerSheet, "Ledgers");

      const checklistSheetData = [
        ["Control Point", "Status", "Owner", "Reference", "Due Date", "Remarks"],
        ...checklist.map((row) => [
          row.title,
          row.status,
          row.owner,
          row.reference,
          row.dueDate,
          row.remarks ?? ""
        ])
      ];
      const complianceSheet = XLSX.utils.aoa_to_sheet(checklistSheetData);
      XLSX.utils.book_append_sheet(wb, complianceSheet, "Compliance");

      const macrosSheet = XLSX.utils.aoa_to_sheet(headers.macroInstructions);
      XLSX.utils.book_append_sheet(wb, macrosSheet, "Macro_Map");

      const readmeSheet = XLSX.utils.aoa_to_sheet([
        ["Tahri Mahmood Advocate - Tax Automation Template"],
        ["Generated", new Date().toLocaleString("en-PK")],
        ["Instructions"],
        ["1.", "Enable macros on first open: File > Options > Trust Center > Macro Settings."],
        ["2.", "Use Navigation sheet macro buttons to automate workflows."],
        ["3.", "Data entry sheets are colour-coded (green = input, blue = calculation)."],
        ["4.", "Update compliance statuses before running `Create_IRIS_XML`."],
        ["5.", "All sheets are flexible—insert or delete rows without breaking formulas."]
      ]);
      XLSX.utils.book_append_sheet(wb, readmeSheet, "README");

      const fileName = `tahir-tax-automation-${selectedClient.taxYear}.xlsm`;
      XLSX.writeFile(wb, fileName, { bookType: "xlsm" });
    } finally {
      setTimeout(() => setIsGenerating(false), 600);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={!selectedClient || isGenerating}
      className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
    >
      {isGenerating ? (
        <>
          <CheckCircleIcon className="h-4 w-4 animate-pulse" />
          Preparing workbook...
        </>
      ) : (
        <>
          <ArrowDownTrayIcon className="h-4 w-4" />
          Download Excel Tax Suite
        </>
      )}
    </button>
  );
};

export default WorkbookExporter;
