import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type KpiTone = "blue" | "amber" | "green" | "rose";

export type KpiCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon?: ReactNode;
  tone?: KpiTone;
  critical?: boolean;
};

const toneStyles: Record<KpiTone, { card: string; icon: string; value: string; glow: string }> = {
  blue: {
    card: "from-white via-white to-blue-50/80",
    icon: "bg-blue-50 text-blue-600 ring-blue-100",
    value: "text-primary",
    glow: "bg-blue-400/18"
  },
  amber: {
    card: "from-white via-white to-amber-50/85",
    icon: "bg-amber-50 text-amber-600 ring-amber-100",
    value: "text-primary",
    glow: "bg-amber-400/20"
  },
  green: {
    card: "from-white via-white to-emerald-50/85",
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    value: "text-primary",
    glow: "bg-emerald-400/18"
  },
  rose: {
    card: "from-white via-white to-rose-50/85",
    icon: "bg-rose-50 text-rose-600 ring-rose-100",
    value: "text-primary",
    glow: "bg-rose-400/18"
  }
};

export function KpiCard({ title, value, description, icon, tone = "blue", critical = false }: KpiCardProps) {
  const styles = toneStyles[tone];

  return (
    <article
      className={cn(
        "group relative min-h-[132px] overflow-hidden rounded-2xl border p-md shadow-[0_18px_42px_rgba(15,23,42,0.09)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(15,23,42,0.13)] max-lg:min-h-[112px] max-lg:p-sm",
        critical
          ? "border-amber-300/45 bg-[linear-gradient(135deg,#101827_0%,#0D1117_52%,#05070D_100%)] text-white ring-1 ring-white/[0.05]"
          : cn(
              "border-white/90 bg-gradient-to-br ring-1 ring-slate-200/70 max-lg:border-slate-800/90 max-lg:from-[#121A29] max-lg:via-[#0F1724] max-lg:to-[#0A0F1A] max-lg:ring-white/[0.05]",
              styles.card
            )
      )}
    >
      <div className={cn("absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl", critical ? "bg-orange-500/16" : styles.glow)} />
      <div className="relative flex h-full flex-col justify-between gap-md">
        <div className="flex items-start justify-between gap-md">
          <p className={cn("font-etiqueta text-[12px] font-bold uppercase leading-4 tracking-wide", critical ? "text-amber-100" : "text-slate-600 max-lg:text-slate-300")}>
            {title}
          </p>
          <span
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-2xl ring-1 transition-transform group-hover:scale-105",
              critical ? "bg-orange-400 text-slate-950 ring-orange-200 shadow-[0_0_22px_rgba(251,146,60,0.32)]" : cn(styles.icon, "max-lg:bg-white/[0.07] max-lg:text-amber-300 max-lg:ring-white/10")
            )}
          >
            {icon}
          </span>
        </div>

        <div>
          <p className={cn("font-titulo-principal text-[36px] leading-none tracking-normal max-lg:text-[28px]", critical ? "text-orange-300" : cn(styles.value, "max-lg:text-white"))}>
            {value}
          </p>
          <p className={cn("mt-xs text-sm leading-5 max-lg:text-[12px] max-lg:leading-4", critical ? "text-slate-300" : "text-on-surface-variant max-lg:text-slate-400")}>
            {description ?? "Indicador actualizado del sistema"}
          </p>
        </div>
      </div>
    </article>
  );
}
