# Tahir Mahmood Advocate — Tax Automation Suite

A Next.js dashboard that guides novice staff—step-by-step and cell-by-cell—through preparing a fully reconciled Excel workbook for Pakistan income tax year 2025 onwards. The interface mirrors the final workbook layout, covers wealth and reconciliation statements, trading/manufacturing/P&L schedules, and surfaces FBR (IRIS) compliance controls. It also exposes the accompanying VBA macro library and exports a colourful `.xlsm` ready for customisation.

## ✨ Highlights

- **Guided workspace** — instructions reference exact sheets/columns (e.g. `Wealth!B:H`) so data entry stays aligned with the Excel template.
- **Dynamic registers** — wealth statement, trading, manufacturing and P&L grids support unlimited rows with running totals.
- **Tax slab engine** — computes individual, salaried and AOP slabs per Income Tax Ordinance 2001 (2025 rates) with breakdown tables.
- **Compliance tracker** — status-driven checklist for IRIS filings, withholding statements and reconciliations.
- **Macro showcase** — curated VBA procedures (Prepare_Tax_File, Build_Wealth_Summary, Create_IRIS_XML, etc.) ready for copy/paste.
- **One-click export** — generates a macro-enabled workbook scaffold (`.xlsm`) reflecting the data captured in the UI.

## 🧱 Tech Stack

- [Next.js 14 (App Router)](https://nextjs.org/)
- [React 18](https://react.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand) for client-side state
- [SheetJS](https://sheetjs.com/) (`xlsx`) for Excel generation
- [Framer Motion](https://www.framer.com/motion/) for subtle transitions
- Heroicons & Headless UI for polished UI accents

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000` to explore the interface.

| Script            | Purpose                                     |
| ----------------- | ------------------------------------------- |
| `npm run dev`     | Run local development server                |
| `npm run build`   | Production build (runs lint + type checks)  |
| `npm run lint`    | ESLint via `next lint`                      |
| `npm run typecheck` | Strict TypeScript validation             |

## 📦 Exported Workbook

The **Download Excel Tax Suite** button produces `tahir-tax-automation-<taxYear>.xlsm` containing:

- Client profile, tax calculation, wealth, ledger and compliance sheets
- Macro map + README with onboarding notes
- VBA source snippets mirrored in the UI for quick importing

⚠️ Macros ship as source code snippets. Paste them into the generated workbook’s VBA editor (Alt+F11) and save — this keeps the template flexible for firm-specific automation.

## 🗂️ Project Structure

```
app/                  # Next.js App Router pages/layout
components/           # UI building blocks (cards, grids, macros)
lib/                  # Tax tables + helpers
store/                # Zustand state for workbook data
public/               # Static assets (if any)
```

## 🛡️ Notes

- Tax slabs mirror the Income Tax Ordinance 2001 tables for tax year 2025 (individual, salaried & AOP).
- Additional withholding / special income rates (dividends, rental, profit on debt, etc.) live in `lib/tax.ts` and can be extended easily.
- Workbook export intentionally leaves space between headings so staff can insert/delete rows without breaking formulas once opened in Excel.

## 📮 Feedback

Ideas to extend:

1. Wire up real macro embedding by generating `vbaProject.bin`.
2. Add PDF or IRIS XML generation endpoints.
3. Plug in Supabase/Postgres for storing client runs.

Pull requests and suggestions welcome!***
