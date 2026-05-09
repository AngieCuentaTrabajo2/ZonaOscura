import { ReportsTable } from "@/components/reports/ReportsTable";
import { obtenerReportes } from "@/features/reportes/reporte.service";
import { reportesDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function ReportesPage() {
  let reportes = reportesDemo;
  try {
    reportes = await obtenerReportes();
  } catch {}

  return (
    <div className="flex flex-col gap-lg">
      <section className="rounded-lg border border-slate-200 bg-white/85 p-lg shadow-sm">
        <p className="font-etiqueta text-etiqueta font-semibold uppercase text-safety-blue">Seguimiento ciudadano</p>
        <h1 className="mt-xs font-titulo-principal text-titulo-principal text-primary">Reportes registrados</h1>
        <p className="mt-xs text-on-surface-variant">Consulta estado, distrito, tipo de problema y detalle de cada zona oscura registrada.</p>
      </section>
      <ReportsTable reportes={reportes} />
    </div>
  );
}
