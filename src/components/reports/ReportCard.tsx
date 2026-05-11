import type { ReporteZonaOscura } from "@prisma/client";
import { CardReporte } from "@/components/reports/CardReporte";

export function ReportCard({ reporte }: { reporte: ReporteZonaOscura }) {
  return <CardReporte reporte={reporte} />;
}
