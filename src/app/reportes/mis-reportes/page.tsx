import { ReportCard } from "@/components/reports/ReportCard";
import { obtenerReportes } from "@/features/reportes/reporte.service";
import { reportesDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function MisReportesPage() {
  let reportes = reportesDemo;
  try {
    reportes = await obtenerReportes();
  } catch {}

  const criticos = reportes.filter((reporte) => reporte.prioridad === "ALTA").length;
  const atendidos = reportes.filter((reporte) => reporte.estado === "ATENDIDO").length;

  return (
    <div className="theme-page flex flex-col gap-lg max-lg:-mx-[18px] max-lg:-mt-[26px] max-lg:min-h-[calc(100vh-80px)] max-lg:bg-[#0f172a] max-lg:px-[18px] max-lg:pb-md max-lg:pt-[28px] lg:gap-lg">
      <section className="theme-hero relative overflow-hidden rounded-[24px] border border-slate-700/70 bg-[linear-gradient(145deg,#111827_0%,#0f172a_52%,#101827_100%)] p-lg text-white shadow-[0_18px_44px_rgba(2,6,23,0.35)] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:text-primary lg:shadow-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_0%,rgba(251,191,36,0.16),transparent_18rem)] lg:hidden" />
        <div className="relative">
          <p className="mb-xs hidden font-etiqueta text-[12px] font-bold uppercase tracking-wide text-amber-200 lg:block">Seguimiento ciudadano</p>
          <h1 className="theme-text-primary font-titulo-principal text-[32px] leading-tight text-white lg:text-titulo-principal lg:text-primary">Mis reportes</h1>
          <p className="theme-text-muted mt-xs max-w-sm text-[15px] leading-6 text-slate-300 lg:text-on-surface-variant">
            Seguimiento de las zonas oscuras que has registrado.
          </p>
          <div className="mt-md grid grid-cols-3 gap-xs lg:hidden">
            <Metric label="reportes" value={reportes.length} />
            <Metric label="críticos" value={criticos} />
            <Metric label="atendidos" value={atendidos} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
        {reportes.map((reporte) => (
          <ReportCard key={reporte.id} reporte={reporte} />
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      <p className="text-[20px] font-bold text-white">{value}</p>
      <p className="text-[11px] font-semibold text-slate-300">{label}</p>
    </div>
  );
}
