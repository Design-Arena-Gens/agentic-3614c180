import { Fragment } from "react";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type InstructionStep = {
  id: string;
  title: string;
  sheet: string;
  cellReference: string;
  action: string;
  tip: string;
};

const instructionSteps: InstructionStep[] = [
  {
    id: "step-1",
    title: "Capture Client Profile",
    sheet: "Client_Profile",
    cellReference: "Cells B5:G18",
    action:
      "Enter taxpayer name, CNIC/NTN, residency and filing status. Mark professional firm toggle in cell G12 for AOPs that qualify for 40% cap.",
    tip: "Use the drop-down data validation in column E to lock status selection."
  },
  {
    id: "step-2",
    title: "Input Income Streams",
    sheet: "Tax_Calc",
    cellReference: "Cells D8:D19",
    action:
      "Populate salary, business, pension and other taxable streams. The workbook auto-calculates slab wise tax and withholding reconciliation.",
    tip: "Green columns show entry cells while blue columns display computed tax."
  },
  {
    id: "step-3",
    title: "Record Wealth Opening & Closing",
    sheet: "Wealth",
    cellReference: "Columns B:H",
    action:
      "For each asset, liability and equity head, break down opening, additions, disposals and closing balances. The reconciliation sheet pulls summary totals automatically.",
    tip: "Insert blank spacer rows between asset categories to keep the export organised."
  },
  {
    id: "step-4",
    title: "Update Trading & Manufacturing Ledgers",
    sheet: "Trading_Account / Manufacturing",
    cellReference: "Columns B:G",
    action:
      "Enter opening stock, purchases, carriage inwards and conversion cost details. Buttons on the ribbon rescale totals directly into the Profit & Loss account.",
    tip: "Reference the narration column to preserve the audit trail requested during IRIS reviews."
  },
  {
    id: "step-5",
    title: "Complete Profit & Loss Mapping",
    sheet: "Profit_Loss",
    cellReference: "Columns B:H",
    action:
      "Feed revenue, cost of sales, operating expenditures and other incomes. The net profit figure flows to the tax computation and wealth reconciliation automatically.",
    tip: "Cells H12:H30 include quick variance flags when prior year comparisons are available."
  },
  {
    id: "step-6",
    title: "Perform Compliance Sweep",
    sheet: "Compliance",
    cellReference: "Cells B6:H22",
    action:
      "Tick off withholding statements, challans, advance tax data and annexures. Status updates drive the dashboard and macro triggers for ready-to-file readiness.",
    tip: "Color-coded statuses map to IRIS workflow gates for faster reviews."
  },
  {
    id: "step-7",
    title: "Generate Submission Pack",
    sheet: "Navigation",
    cellReference: "Macro Buttons A4:A12",
    action:
      "Run macros `Prepare_Tax_File`, `Build_Wealth_Summary` and `Create_IRIS_XML` in sequence. Outputs land in the `Outputs` folder ready for taxpayer sign-off.",
    tip: "Always run the `Backup_Current_Version` macro before finalising adjustments."
  }
];

export const InstructionStepper = () => (
  <div className="flex flex-col gap-4">
    {instructionSteps.map((step, index) => (
      <Fragment key={step.id}>
        <motion.div
          layout
          className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-card"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                Step {index + 1}
              </p>
              <h3 className="text-lg font-semibold text-slate-900">
                {step.title}
              </h3>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-semibold text-slate-600">{step.sheet}</p>
              <p>{step.cellReference}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">
            {step.action}
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
            <ChevronRightIcon className="h-4 w-4" />
            <span className="font-medium">Tip:</span>
            <span>{step.tip}</span>
          </div>
        </motion.div>
      </Fragment>
    ))}
  </div>
);

export default InstructionStepper;
