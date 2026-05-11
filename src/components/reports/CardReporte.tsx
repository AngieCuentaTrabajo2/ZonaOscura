import Link from "next/link";
import type { EstadoReporte, NivelPrioridad, ReporteZonaOscura } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { cn, etiquetasEstadoReporte, etiquetasPrioridad, etiquetasTipoProblema, formatearFecha } from "@/lib/utils";

export function CardReporte({ reporte }: { reporte: ReporteZonaOscura }) {
  return (
    <>
      <MobileCardReporte reporte={reporte} />
      <DesktopCardReporte reporte={reporte} />
    </>
  );
}

function DesktopCardReporte({ reporte }: { reporte: ReporteZonaOscura }) {
  return (
    <Card className="hidden rounded-2xl p-md shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_52px_rgba(15,23,42,0.12)] lg:block">
      <div className="flex items-start justify-between gap-md">
        <div className="min-w-0">
          <ReportMeta codigo={reporte.codigo} fecha={reporte.fechaCreacion} dark={false} />
          <h3 className="mt-sm font-subtitulo text-[19px] font-bold leading-snug text-primary">{reporte.direccion}</h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-xs">
          <PriorityBadge prioridad={reporte.prioridad} />
          <StateBadge estado={reporte.estado} />
        </div>
      </div>

      <div className="mt-md grid gap-xs text-sm text-on-surface-variant">
        <ReportDetail icon="location_on" label={reporte.distrito} />
        <ReportDetail icon="lightbulb" label={etiquetasTipoProblema[reporte.tipoProblema]} />
      </div>

      <DetailLink href={`/reportes/${reporte.id}`} dark={false} />
    </Card>
  );
}

function MobileCardReporte({ reporte }: { reporte: ReporteZonaOscura }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-[linear-gradient(145deg,rgba(17,24,39,0.96),rgba(13,17,23,0.98))] p-md shadow-[0_18px_46px_rgba(2,6,23,0.42)] ring-1 ring-white/[0.05] backdrop-blur lg:hidden">
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/75 to-transparent" />
      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative flex items-start justify-between gap-md">
        <div className="min-w-0 flex-1">
          <ReportMeta codigo={reporte.codigo} fecha={reporte.fechaCreacion} dark />
          <h3 className="mt-sm font-subtitulo text-[18px] font-bold leading-snug text-slate-50">{reporte.direccion}</h3>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-xs">
          <PriorityBadge prioridad={reporte.prioridad} dark />
          <StateBadge estado={reporte.estado} dark />
        </div>
      </div>

      <div className="relative mt-md grid gap-xs text-[13px] text-slate-300">
        <ReportDetail icon="location_on" label={reporte.distrito} dark />
        <ReportDetail icon="lightbulb" label={etiquetasTipoProblema[reporte.tipoProblema]} dark />
      </div>

      <DetailLink href={`/reportes/${reporte.id}`} dark />
    </article>
  );
}

function ReportMeta({ codigo, fecha, dark }: { codigo: string; fecha: Date | string; dark: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-xs text-[12px]", dark ? "text-slate-400" : "text-slate-500")}>
      <span className={cn("font-mono font-semibold tracking-wide", dark ? "text-slate-400" : "text-slate-600")}>{codigo}</span>
      <span className={cn("h-1 w-1 rounded-full", dark ? "bg-slate-600" : "bg-slate-300")} />
      <span className="inline-flex items-center gap-1 font-medium">
        <span className="material-symbols-outlined text-[14px]">calendar_month</span>
        {formatearFecha(fecha)}
      </span>
    </div>
  );
}

function ReportDetail({ icon, label, dark = false }: { icon: string; label: string; dark?: boolean }) {
  return (
    <p className="flex min-w-0 items-center gap-sm">
      <span className={cn("material-symbols-outlined text-[17px]", dark ? "text-amber-300/90" : "text-safety-blue")}>{icon}</span>
      <span className="truncate">{label}</span>
    </p>
  );
}

function DetailLink({ href, dark }: { href: string; dark: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "mt-md inline-flex h-10 items-center justify-center gap-xs rounded-xl px-md text-sm font-semibold transition",
        dark
          ? "border border-white/10 bg-white/[0.07] text-slate-50 hover:bg-white/[0.12]"
          : "border border-slate-200 bg-slate-50 text-primary hover:border-blue-200 hover:bg-blue-50"
      )}
    >
      Ver detalle
      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
    </Link>
  );
}

function PriorityBadge({ prioridad, dark = false }: { prioridad: NivelPrioridad; dark?: boolean }) {
  const label = prioridad === "ALTA" ? "Prioridad alta" : etiquetasPrioridad[prioridad];
  return (
    <span
      className={cn(
        "rounded-xl px-sm py-xs text-[12px] font-bold leading-4",
        prioridad === "ALTA" && (dark ? "bg-orange-400/16 text-orange-100 ring-1 ring-orange-300/30" : "bg-orange-100 text-orange-700"),
        prioridad === "MEDIA" && (dark ? "bg-blue-400/16 text-blue-100 ring-1 ring-blue-300/25" : "bg-blue-100 text-blue-700"),
        prioridad === "BAJA" && (dark ? "bg-emerald-400/14 text-emerald-100 ring-1 ring-emerald-300/25" : "bg-emerald-100 text-emerald-700")
      )}
    >
      {label}
    </span>
  );
}

function StateBadge({ estado, dark = false }: { estado: EstadoReporte; dark?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-xl px-sm py-xs text-[12px] font-semibold leading-4",
        estado === "PENDIENTE" && (dark ? "bg-slate-500/28 text-slate-100 ring-1 ring-slate-300/20" : "bg-slate-100 text-slate-700"),
        estado === "EN_EVALUACION" && (dark ? "bg-blue-500/16 text-blue-100 ring-1 ring-blue-300/25" : "bg-blue-100 text-blue-700"),
        estado === "EN_PROCESO" && (dark ? "bg-cyan-500/16 text-cyan-100 ring-1 ring-cyan-300/25" : "bg-cyan-100 text-cyan-700"),
        estado === "ATENDIDO" && (dark ? "bg-emerald-500/16 text-emerald-100 ring-1 ring-emerald-300/25" : "bg-emerald-100 text-emerald-700"),
        estado === "RECHAZADO" && (dark ? "bg-rose-500/16 text-rose-100 ring-1 ring-rose-300/25" : "bg-rose-100 text-rose-700")
      )}
    >
      {etiquetasEstadoReporte[estado]}
    </span>
  );
}
