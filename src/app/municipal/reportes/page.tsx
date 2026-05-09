import { MunicipalReportsTable } from "@/components/municipal/MunicipalReportsTable";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
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
      <Card className="grid grid-cols-1 gap-md p-md lg:grid-cols-5">
        <Input placeholder="Buscar código o dirección" />
        <Select><option>Todos los distritos</option><option>Pachacámac</option><option>Manchay</option><option>José Gálvez</option></Select>
        <Select><option>Todos los estados</option><option>Pendiente</option><option>En evaluación</option><option>Atendido</option></Select>
        <Select><option>Prioridad</option><option>Alta</option><option>Media</option><option>Baja</option></Select>
        <input type="date" className="h-10 rounded-lg border border-outline-variant bg-surface-container-lowest px-md" />
      </Card>
      <MunicipalReportsTable reportes={reportes} />
    </div>
  );
}
