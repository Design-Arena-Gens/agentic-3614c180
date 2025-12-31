"use client";

import ClientSelector from "@/components/ClientSelector";
import SectionCard from "@/components/SectionCard";
import TaxSummary from "@/components/TaxSummary";
import WealthStatementGrid from "@/components/WealthStatementGrid";
import LedgerGrids from "@/components/LedgerGrids";
import ComplianceChecklist from "@/components/ComplianceChecklist";
import InstructionStepper from "@/components/InstructionStepper";
import MacroShowcase from "@/components/MacroShowcase";
import MacroActivityLog from "@/components/MacroActivityLog";
import WorkbookExporter from "@/components/WorkbookExporter";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-10">
      <header className="rounded-3xl border border-brand-200 bg-gradient-to-br from-brand-50 via-white to-emerald-50 p-10 shadow-lg">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-700">
              Tahir Mahmood Advocate — Tax Automation Suite
            </p>
            <h1 className="text-4xl font-bold text-slate-900">
              Guided Excel Automation for Pakistan Income Tax (Tax Year 2025 onwards)
            </h1>
            <p className="text-base leading-relaxed text-slate-700">
              A complete, colour-coded workbook generator with macros, wealth reconciliation,
              profit & loss mapping and compliance controls aligned to FBR IRIS workflows. Follow
              the step-by-step prompts, capture data once and produce ready-to-file submissions for
              individuals, salaried taxpayers and AOPs.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <WorkbookExporter />
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <InformationCircleIcon className="h-4 w-4" />
              Download delivers an `.xlsm` workbook with automation-ready layout.
            </p>
          </div>
        </div>
      </header>

      <SectionCard
        title="Workspace Selector"
        description="Switch between clients or create a new workspace. Each selection feeds the tax calculation, wealth statement and compliance dashboards automatically."
        accent="emerald"
      >
        <ClientSelector />
      </SectionCard>

      <SectionCard
        title="Tax Calculation Snapshot"
        description="Live computation of slabs for individuals, salaried taxpayers and AOPs based on the Income Tax Ordinance 2001 (updated for tax year 2025)."
        accent="sky"
      >
        <TaxSummary />
      </SectionCard>

      <SectionCard
        title="Wealth Statement & Reconciliation"
        description="Maintain a flexible structure for assets, liabilities and equity with automatic closing balances for wealth and reconciliation statements."
        accent="teal"
      >
        <WealthStatementGrid />
      </SectionCard>

      <SectionCard
        title="Trading, Manufacturing & Profit and Loss Accounts"
        description="Capture ledgers with debit/credit controls. Totals flow into the tax engine and reconciliation sheet."
        accent="violet"
      >
        <LedgerGrids />
      </SectionCard>

      <SectionCard
        title="Compliance & Workflow Checklist"
        description="Track filing milestones, withholding reconciliations and IRIS submission tasks with status-driven highlights."
        accent="amber"
      >
        <ComplianceChecklist />
      </SectionCard>

      <SectionCard
        title="Step-by-Step Guidance"
        description="Every sheet references the exact cells and columns so a novice can update the workbook confidently."
        accent="emerald"
      >
        <InstructionStepper />
      </SectionCard>

      <SectionCard
        title="Automation & VBA Library"
        description="Copy any macro directly into the Visual Basic editor. Buttons in the workbook reference the same procedures."
        accent="sky"
      >
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <MacroShowcase />
          <MacroActivityLog />
        </div>
      </SectionCard>
    </div>
  );
}
