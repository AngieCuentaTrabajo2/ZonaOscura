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
      <section className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white/85 p-lg shadow-sm max-lg:border-slate-700/70 max-lg:bg-[linear-gradient(145deg,#111827_0%,#0f172a_52%,#0D1117_100%)] max-lg:p-md max-lg:text-white max-lg:shadow-[0_18px_44px_rgba(2,6,23,0.35)]">
        <div className="absolute -right-20 -top-20 hidden h-44 w-44 rounded-full bg-amber-400/12 blur-3xl max-lg:block" />
        <div className="relative">
          <p className="font-etiqueta text-etiqueta font-semibold uppercase text-safety-blue max-lg:text-amber-200">US02 · rutas nocturnas seguras</p>
          <h1 className="mt-xs font-titulo-principal text-titulo-principal text-primary max-lg:text-[31px] max-lg:text-white">Mapa de zonas oscuras</h1>
          <p className="mt-xs max-w-3xl text-on-surface-variant max-lg:text-[14px] max-lg:leading-6 max-lg:text-slate-300">
            Visualiza reportes geolocalizados con mapa gratuito MapLibre, filtros por distrito, estado, prioridad y tipo de problema.
          </p>
        </div>
      </section>
      <ReportExplorer reportes={reportes} mode="map" />
    </div>
  );
}
