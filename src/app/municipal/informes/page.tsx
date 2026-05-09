import { InformePreview } from "@/components/municipal/InformePreview";
import { PriorityList } from "@/components/municipal/PriorityList";
import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { obtenerPrioridadesMunicipales } from "@/features/municipal/prioridad.service";
import { reportesDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function InformesPage() {
  let reportes: any[] = reportesDemo.map((reporte) => ({ ...reporte, _count: { confirmaciones: 5 } }));
  try {
    reportes = await obtenerPrioridadesMunicipales();
  } catch {}

  return (
    <div className="flex flex-col gap-xl">
      <section className="rounded-lg border border-emerald-100 bg-white/85 p-lg shadow-sm">
        <p className="font-etiqueta text-etiqueta font-semibold uppercase text-safety-green">US04 · informe priorizado</p>
        <h1 className="mt-xs font-titulo-principal text-titulo-principal text-primary">Informes municipales</h1>
        <p className="mt-xs text-on-surface-variant">Genera una vista previa y descarga un PDF operativo para sustentar acciones de mantenimiento.</p>
      </section>
      <Card className="grid grid-cols-1 gap-md p-md lg:grid-cols-4">
        <Select><option>Todos los distritos</option><option>Pachacámac</option></Select>
        <input type="date" className="h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-md" />
        <input type="date" className="h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-md" />
        <Select><option>Todos los estados</option><option>Pendiente</option><option>Atendido</option></Select>
      </Card>
      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="mb-md font-subtitulo text-subtitulo">Vista previa de prioridades</h2>
          <PriorityList reportes={reportes.slice(0, 5)} />
        </div>
        <aside className="lg:col-span-4">
          <InformePreview />
        </aside>
      </div>
    </div>
  );
}
