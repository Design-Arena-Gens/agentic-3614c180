import { create } from "zustand";
import { nanoid } from "nanoid/non-secure";
import { computeCompositeTax } from "@/lib/tax";

export type TaxpayerCategory = "Individual" | "Salaried" | "Association of Persons" | "Business";

export type ClientRecord = {
  id: string;
  name: string;
  taxpayerCategory: TaxpayerCategory;
  residencyStatus: "Resident" | "Non-Resident";
  nationalId: string;
  taxYear: number;
  professionalFirm: boolean;
  salaryIncome: number;
  businessIncome: number;
  otherTaxableIncome: number;
  deductions: number;
  pensionIncome: number;
  filerStatus: "Filer" | "Non-Filer";
};

export type WealthRow = {
  id: string;
  head: "Assets" | "Liabilities" | "Equity";
  subHead: string;
  description: string;
  openingBalance: number;
  additions: number;
  disposals: number;
  closingBalance: number;
  remarks?: string;
};

export type LedgerRow = {
  id: string;
  sheet: "Trading" | "Manufacturing" | "ProfitAndLoss";
  accountHead: string;
  particulars: string;
  debit: number;
  credit: number;
  notes?: string;
};

export type ComplianceChecklistItem = {
  id: string;
  title: string;
  status: "Pending" | "Prepared" | "Reviewed" | "Filed";
  owner: string;
  reference: string;
  dueDate: string;
  remarks?: string;
};

export type MacroActionLog = {
  id: string;
  action: string;
  timestamp: string;
  details: string;
};

type WorkbookState = {
  clients: ClientRecord[];
  selectedClientId?: string;
  wealthStatement: WealthRow[];
  ledgers: LedgerRow[];
  complianceChecklist: ComplianceChecklistItem[];
  macroLog: MacroActionLog[];
  addClient: (client: Partial<ClientRecord>) => string;
  updateClient: (id: string, update: Partial<ClientRecord>) => void;
  selectClient: (id: string) => void;
  removeClient: (id: string) => void;
  upsertWealthRow: (row: Partial<WealthRow> & { id?: string }) => void;
  removeWealthRow: (id: string) => void;
  upsertLedgerRow: (row: Partial<LedgerRow> & { id?: string }) => void;
  removeLedgerRow: (id: string) => void;
  upsertChecklist: (item: Partial<ComplianceChecklistItem> & { id?: string }) => void;
  removeChecklist: (id: string) => void;
  appendMacroLog: (entry: Omit<MacroActionLog, "id" | "timestamp">) => void;
  getActiveClient: () => ClientRecord | undefined;
  computeActiveClientTax: () =>
    | ReturnType<typeof computeCompositeTax>
    | undefined;
};

const defaultClient: ClientRecord = {
  id: nanoid(),
  name: "Tahir Mahmood Advocate",
  taxpayerCategory: "Association of Persons",
  residencyStatus: "Resident",
  nationalId: "00000-0000000-0",
  taxYear: 2025,
  professionalFirm: true,
  salaryIncome: 0,
  businessIncome: 8_500_000,
  otherTaxableIncome: 950_000,
  deductions: 750_000,
  pensionIncome: 0,
  filerStatus: "Filer"
};

const starterWealth: WealthRow[] = [
  {
    id: nanoid(),
    head: "Assets",
    subHead: "Fixed Assets",
    description: "Office Premises - Saddar Karachi",
    openingBalance: 12_500_000,
    additions: 0,
    disposals: 0,
    closingBalance: 12_500_000,
    remarks: "Include cost per title deed"
  },
  {
    id: nanoid(),
    head: "Assets",
    subHead: "Current Assets",
    description: "Accounts Receivable - Corporate Clients",
    openingBalance: 3_200_000,
    additions: 1_450_000,
    disposals: 900_000,
    closingBalance: 3_750_000
  },
  {
    id: nanoid(),
    head: "Liabilities",
    subHead: "Current Liabilities",
    description: "Withholding Taxes Payable",
    openingBalance: 650_000,
    additions: 780_000,
    disposals: 700_000,
    closingBalance: 730_000
  },
  {
    id: nanoid(),
    head: "Equity",
    subHead: "Capital Introduced",
    description: "Partner Capital Tahir Mahmood",
    openingBalance: 9_850_000,
    additions: 1_200_000,
    disposals: 0,
    closingBalance: 11_050_000
  }
];

const starterLedgers: LedgerRow[] = [
  {
    id: nanoid(),
    sheet: "Trading",
    accountHead: "Legal Service Income",
    particulars: "Retainers - Industrial Clients",
    debit: 0,
    credit: 4_500_000,
    notes: "Enter monthly retainers for manufacturing clients"
  },
  {
    id: nanoid(),
    sheet: "ProfitAndLoss",
    accountHead: "Administrative Expenses",
    particulars: "Staff Salaries",
    debit: 2_300_000,
    credit: 0,
    notes: "Map to Sheet P&L, column F"
  },
  {
    id: nanoid(),
    sheet: "Manufacturing",
    accountHead: "Cost Allocation",
    particulars: "Research & Compliance Documentation",
    debit: 480_000,
    credit: 0,
    notes: "Distribute between projects for audit trail"
  }
];

const starterChecklist: ComplianceChecklistItem[] = [
  {
    id: nanoid(),
    title: "IRIS Login Credentials Validated",
    status: "Prepared",
    owner: "Tax Associate",
    reference: "Cell B5 - Compliance Sheet",
    dueDate: new Date().toISOString().slice(0, 10),
    remarks: "Update annually or on notification"
  },
  {
    id: nanoid(),
    title: "Withholding Statements Reconciled",
    status: "Pending",
    owner: "Senior Associate",
    reference: "Cells F9:F18",
    dueDate: new Date().toISOString().slice(0, 10),
    remarks: "Cross-check against e-FBR portal downloads"
  }
];

export const useWorkbookStore = create<WorkbookState>((set, get) => ({
  clients: [defaultClient],
  selectedClientId: defaultClient.id,
  wealthStatement: starterWealth,
  ledgers: starterLedgers,
  complianceChecklist: starterChecklist,
  macroLog: [],
  addClient: (client) => {
    const id = nanoid();
    const currentYear = new Date().getFullYear();
    const newClient: ClientRecord = {
      id,
      name: client.name ?? "New Client",
      taxpayerCategory: client.taxpayerCategory ?? "Individual",
      residencyStatus: client.residencyStatus ?? "Resident",
      nationalId: client.nationalId ?? "00000-0000000-0",
      taxYear: client.taxYear ?? currentYear,
      professionalFirm: client.professionalFirm ?? false,
      salaryIncome: client.salaryIncome ?? 0,
      businessIncome: client.businessIncome ?? 0,
      otherTaxableIncome: client.otherTaxableIncome ?? 0,
      deductions: client.deductions ?? 0,
      pensionIncome: client.pensionIncome ?? 0,
      filerStatus: client.filerStatus ?? "Filer"
    };

    set((state) => ({
      clients: [...state.clients, newClient],
      selectedClientId: id
    }));
    return id;
  },
  updateClient: (id, update) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...update } : client
      )
    }));
  },
  selectClient: (id) => set({ selectedClientId: id }),
  removeClient: (id) =>
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
      selectedClientId:
        state.selectedClientId === id
          ? state.clients.find((client) => client.id !== id)?.id
          : state.selectedClientId
    })),
  upsertWealthRow: (row) =>
    set((state) => {
      const id = row.id ?? nanoid();
      const nextRow: WealthRow = {
        id,
        head: row.head ?? "Assets",
        subHead: row.subHead ?? "Other",
        description: row.description ?? "New Item",
        openingBalance: row.openingBalance ?? 0,
        additions: row.additions ?? 0,
        disposals: row.disposals ?? 0,
        closingBalance:
          row.closingBalance ??
          ((row.openingBalance ?? 0) +
            (row.additions ?? 0) -
            (row.disposals ?? 0)),
        remarks: row.remarks
      };

      const exists = state.wealthStatement.some((item) => item.id === id);
      return {
        wealthStatement: exists
          ? state.wealthStatement.map((item) =>
              item.id === id ? nextRow : item
            )
          : [...state.wealthStatement, nextRow]
      };
    }),
  removeWealthRow: (id) =>
    set((state) => ({
      wealthStatement: state.wealthStatement.filter((row) => row.id !== id)
    })),
  upsertLedgerRow: (row) =>
    set((state) => {
      const id = row.id ?? nanoid();
      const nextRow: LedgerRow = {
        id,
        sheet: row.sheet ?? "ProfitAndLoss",
        accountHead: row.accountHead ?? "New Head",
        particulars: row.particulars ?? "",
        debit: row.debit ?? 0,
        credit: row.credit ?? 0,
        notes: row.notes
      };
      const exists = state.ledgers.some((item) => item.id === id);
      return {
        ledgers: exists
          ? state.ledgers.map((item) =>
              item.id === id ? nextRow : item
            )
          : [...state.ledgers, nextRow]
      };
    }),
  removeLedgerRow: (id) =>
    set((state) => ({
      ledgers: state.ledgers.filter((row) => row.id !== id)
    })),
  upsertChecklist: (item) =>
    set((state) => {
      const id = item.id ?? nanoid();
      const next: ComplianceChecklistItem = {
        id,
        title: item.title ?? "New Control",
        status: item.status ?? "Pending",
        owner: item.owner ?? "Unassigned",
        reference: item.reference ?? "",
        dueDate: item.dueDate ?? new Date().toISOString().slice(0, 10),
        remarks: item.remarks
      };
      const exists = state.complianceChecklist.some((row) => row.id === id);
      return {
        complianceChecklist: exists
          ? state.complianceChecklist.map((row) =>
              row.id === id ? next : row
            )
          : [...state.complianceChecklist, next]
      };
    }),
  removeChecklist: (id) =>
    set((state) => ({
      complianceChecklist: state.complianceChecklist.filter((row) => row.id !== id)
    })),
  appendMacroLog: (entry) =>
    set((state) => ({
      macroLog: [
        ...state.macroLog,
        {
          id: nanoid(),
          action: entry.action,
          details: entry.details,
          timestamp: new Date().toISOString()
        }
      ]
    })),
  getActiveClient: () => {
    const state = get();
    return state.clients.find((client) => client.id === state.selectedClientId);
  },
  computeActiveClientTax: () => {
    const state = get();
    const active = state.clients.find(
      (client) => client.id === state.selectedClientId
    );
    if (!active) return undefined;
    const taxpayerType =
      active.taxpayerCategory === "Salaried"
        ? "salaried"
        : active.taxpayerCategory === "Association of Persons"
          ? "aop"
          : "individual";
    return computeCompositeTax({
      salaryIncome: active.salaryIncome,
      businessIncome: active.businessIncome,
      otherTaxableIncome: active.otherTaxableIncome,
      deductions: active.deductions,
      resident: active.residencyStatus === "Resident",
      taxpayerType,
      professionalFirm: active.professionalFirm
    });
  }
}));
