import { MunicipalStatsCards } from "@/components/municipal/MunicipalStatsCards";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { obtenerReportes } from "@/features/reportes/reporte.service";
import { reportesDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function HistorialPage() {
  let reportes = reportesDemo.filter((r) => r.estado === "ATENDIDO");
  try {
    reportes = await obtenerReportes({ estado: "ATENDIDO" });
  } catch {}

  return (
    <div className="flex flex-col gap-xl">
      <section className="rounded-lg border border-blue-100 bg-white/85 p-lg shadow-sm">
        <p className="font-etiqueta text-etiqueta font-semibold uppercase text-safety-blue">US03 · trazabilidad municipal</p>
        <h1 className="mt-xs font-titulo-principal text-titulo-principal text-primary">Historial de reportes atendidos</h1>
        <p className="mt-xs text-on-surface-variant">Consulta calles reparadas, fechas de solución e intervenciones realizadas para evitar duplicidad.</p>
      </section>
      <MunicipalStatsCards data={{ total: reportes.length + 46, pendientes: 46, atendidos: reportes.length, criticos: 10 }} />
      <Card className="grid grid-cols-1 gap-md p-md lg:grid-cols-4">
        <Select><option>Todos los distritos</option><option>Pachacámac</option></Select>
        <Select><option>Últimos 30 días</option><option>Mayo 2026</option></Select>
        <Select><option>Todas las intervenciones</option><option>Cambio foco LED</option></Select>
        <Input placeholder="Código o dirección..." />
      </Card>
      <ReportsTable reportes={reportes} />
    </div>
  );
}
