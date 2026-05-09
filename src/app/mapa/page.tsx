import { ReportExplorer } from "@/components/reports/ReportExplorer";
import { obtenerReportes } from "@/features/reportes/reporte.service";
import { reportesDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function MapaPage() {
  let reportes = reportesDemo;
  try {
    reportes = await obtenerReportes();
  } catch {}

  return (
    <div className="flex flex-col gap-lg">
      <section className="rounded-lg border border-blue-100 bg-white/85 p-lg shadow-sm">
        <p className="font-etiqueta text-etiqueta font-semibold uppercase text-safety-blue">US02 · rutas nocturnas seguras</p>
        <h1 className="mt-xs font-titulo-principal text-titulo-principal text-primary">Mapa de zonas oscuras</h1>
        <p className="mt-xs max-w-3xl text-on-surface-variant">Visualiza reportes geolocalizados con mapa gratuito MapLibre, filtros por distrito, estado, prioridad y tipo de problema.</p>
      </section>
      <ReportExplorer reportes={reportes} mode="map" />
    </div>
  );
}
