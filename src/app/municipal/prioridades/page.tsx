import { PriorityList } from "@/components/municipal/PriorityList";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { obtenerPrioridadesMunicipales } from "@/features/municipal/prioridad.service";
import { reportesDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function PrioridadesPage() {
  let reportes: any[] = reportesDemo.map((reporte) => ({ ...reporte, _count: { confirmaciones: reporte.prioridad === "ALTA" ? 12 : 3 } }));
  try {
    reportes = await obtenerPrioridadesMunicipales();
  } catch {}

  return (
    <div className="flex flex-col gap-xl">
      <section className="rounded-lg border border-rose-100 bg-white/85 p-lg shadow-sm">
        <p className="font-etiqueta text-etiqueta font-semibold uppercase text-safety-rose">US04 · priorización operativa</p>
        <h1 className="mt-xs font-titulo-principal text-titulo-principal text-primary">Prioridades de atención</h1>
        <p className="mt-xs text-on-surface-variant">Ordena los reportes según incidencia, riesgo y fecha para planificar intervenciones de luminarias.</p>
      </section>
      <Card className="grid grid-cols-1 gap-md p-md lg:grid-cols-4">
        <Select><option>Todos los distritos</option><option>Pachacámac</option><option>Manchay</option><option>José Gálvez</option></Select>
        <Select><option>Todos los estados</option><option>Pendiente</option><option>En proceso</option></Select>
        <Select><option>Todos los riesgos</option><option>Alto</option><option>Medio</option><option>Bajo</option></Select>
        <input type="date" className="h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-md" />
      </Card>
      <PriorityList reportes={reportes} />
    </div>
  );
}
