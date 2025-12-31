import { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

type SectionCardProps = {
  title: string;
  description?: string;
  accent?: "teal" | "sky" | "violet" | "amber" | "emerald";
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
};

const accentPalette: Record<
  NonNullable<SectionCardProps["accent"]>,
  string
> = {
  teal: "from-teal-50 via-white to-slate-50 border-teal-100",
  sky: "from-sky-50 via-white to-slate-50 border-sky-100",
  violet: "from-violet-50 via-white to-slate-50 border-violet-100",
  amber: "from-amber-50 via-white to-white border-amber-100",
  emerald: "from-emerald-50 via-white to-slate-50 border-emerald-100"
};

export const SectionCard = ({
  title,
  description,
  accent = "teal",
  children,
  actions,
  className
}: SectionCardProps) => (
  <motion.section
    layout
    className={clsx(
      "relative gradient-border overflow-hidden rounded-3xl border bg-gradient-to-br shadow-section",
      accentPalette[accent],
      className
    )}
  >
    <div className="rounded-3xl bg-white/85 p-6 backdrop-blur">
      <div className="flex flex-col gap-3 pb-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="max-w-3xl text-sm text-slate-600">{description}</p>
          )}
        </div>
        {actions && <div className="mt-2 shrink-0 md:mt-0">{actions}</div>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  </motion.section>
);

export default SectionCard;
