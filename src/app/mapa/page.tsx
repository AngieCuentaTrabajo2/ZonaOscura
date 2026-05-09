import { GoogleMapView } from "@/components/maps/GoogleMapView";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { obtenerReportes } from "@/features/reportes/reporte.service";
import { reportesDemo } from "@/lib/demoData";
import { etiquetasTipoProblema } from "@/lib/utils";

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
        <p className="mt-xs max-w-3xl text-on-surface-variant">Visualiza reportes ciudadanos geolocalizados, filtra por distrito y revisa zonas de mayor incidencia antes de desplazarte.</p>
      </section>
      <Card className="grid grid-cols-1 gap-md p-md lg:grid-cols-4">
        <Select><option>Todos los distritos</option><option>Pachacámac</option><option>Manchay</option><option>José Gálvez</option></Select>
        <Select><option>Todos los problemas</option>{Object.entries(etiquetasTipoProblema).map(([key, label]) => <option key={key}>{label}</option>)}</Select>
        <Select><option>Todos los estados</option><option>Pendiente</option><option>En evaluación</option><option>Atendido</option></Select>
        <input type="date" className="h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-md" />
      </Card>
      <div className="grid min-h-[600px] grid-cols-1 gap-lg lg:grid-cols-3">
        <Card className="overflow-hidden p-sm lg:col-span-2">
          <GoogleMapView reportes={reportes} />
        </Card>
        <Card className="p-md">
          <h2 className="border-b border-outline-variant pb-sm font-titulo-seccion text-titulo-seccion text-primary">Zona seleccionada</h2>
          <div className="mt-md flex aspect-video items-center justify-center rounded-lg bg-slate-950 text-amber-200">
            <span className="material-symbols-outlined text-[52px]">location_on</span>
          </div>
          <h3 className="mt-md font-subtitulo text-subtitulo text-primary">{reportes[0]?.direccion ?? "Sin selección"}</h3>
          <p className="mt-xs text-on-surface-variant">Detalle rápido del reporte seleccionado. Puedes confirmar incidencia o abrir la ficha completa.</p>
          <div className="mt-md grid grid-cols-2 gap-sm text-sm">
            <div className="rounded-lg bg-blue-50 p-sm text-safety-blue"><strong>{reportes.length}</strong><br />reportes</div>
            <div className="rounded-lg bg-amber-50 p-sm text-amber-700"><strong>Alta</strong><br />incidencia</div>
          </div>
        </Card>
      </div>
      <ReportsTable reportes={reportes.slice(0, 5)} />
    </div>
  );
}
