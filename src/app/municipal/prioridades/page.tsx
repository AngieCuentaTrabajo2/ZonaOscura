import { ReportExplorer } from "@/components/reports/ReportExplorer";
import { obtenerPrioridadesMunicipales } from "@/features/municipal/prioridad.service";
import { reportesDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function PrioridadesPage() {
  let reportes: any[] = reportesDemo.map((reporte) => ({ ...reporte, _count: { confirmaciones: reporte.prioridad === "ALTA" ? 8 : 3 } }));
  try {
    reportes = await obtenerPrioridadesMunicipales();
  } catch {}

  return (
    <div className="flex flex-col gap-xl">
      <section className="rounded-lg border border-rose-100 bg-white/85 p-lg shadow-sm">
        <p className="font-etiqueta text-etiqueta font-semibold uppercase text-safety-rose">US04 · priorización operativa</p>
        <h1 className="mt-xs font-titulo-principal text-titulo-principal text-primary">Prioridades de atención</h1>
        <p className="mt-xs text-on-surface-variant">Filtra y ordena reportes según incidencia, riesgo, estado y ubicación.</p>
      </section>
      <ReportExplorer reportes={reportes} mode="priority" />
    </div>
  );
}
