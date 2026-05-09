import { ReportExplorer } from "@/components/reports/ReportExplorer";
import { obtenerReportes } from "@/features/reportes/reporte.service";
import { reportesDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function MunicipalReportesPage() {
  let reportes = reportesDemo;
  try {
    reportes = await obtenerReportes();
  } catch {}

  return (
    <div className="flex flex-col gap-lg">
      <section className="rounded-lg border border-slate-200 bg-white/85 p-lg shadow-sm">
        <p className="font-etiqueta text-etiqueta font-semibold uppercase text-safety-blue">Gestión operativa</p>
        <h1 className="mt-xs font-titulo-principal text-titulo-principal text-primary">Gestión de reportes</h1>
        <p className="mt-xs text-on-surface-variant">Filtra, revisa y actualiza reportes ciudadanos.</p>
      </section>
      <ReportExplorer reportes={reportes} />
    </div>
  );
}
