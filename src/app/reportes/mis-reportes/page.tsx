import { ReportCard } from "@/components/reports/ReportCard";
import { obtenerReportes } from "@/features/reportes/reporte.service";
import { reportesDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function MisReportesPage() {
  let reportes = reportesDemo;
  try {
    reportes = await obtenerReportes();
  } catch {}

  return (
    <div className="flex flex-col gap-lg">
      <section>
        <h1 className="font-titulo-principal text-titulo-principal text-primary">Mis reportes</h1>
        <p className="mt-xs text-on-surface-variant">Seguimiento de las zonas oscuras que has registrado.</p>
      </section>
      <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
        {reportes.map((reporte) => <ReportCard key={reporte.id} reporte={reporte} />)}
      </div>
    </div>
  );
}
