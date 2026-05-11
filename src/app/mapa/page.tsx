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
      <section className="theme-hero relative overflow-hidden rounded-2xl border border-blue-100 bg-white/85 p-lg shadow-sm max-lg:p-md">
        <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-amber-400/12 blur-3xl" />
        <div className="relative">
          <p className="theme-accent font-etiqueta text-etiqueta font-semibold uppercase text-safety-blue">US02 · rutas nocturnas seguras</p>
          <h1 className="theme-text-primary mt-xs font-titulo-principal text-titulo-principal text-primary max-lg:text-[31px]">Mapa de zonas oscuras</h1>
          <p className="theme-text-muted mt-xs max-w-3xl text-on-surface-variant max-lg:text-[14px] max-lg:leading-6">
            Visualiza reportes geolocalizados con mapa gratuito MapLibre, filtros por distrito, estado, prioridad y tipo de problema.
          </p>
        </div>
      </section>
      <ReportExplorer reportes={reportes} mode="map" />
    </div>
  );
}
