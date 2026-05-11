import Link from "next/link";
import type { EstadoReporte, NivelPrioridad, TipoProblema } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { etiquetasEstadoReporte, etiquetasPrioridad, etiquetasTipoProblema, formatearFechaHora } from "@/lib/utils";

type ReporteItem = {
  id: string;
  direccion: string;
  tipoProblema: TipoProblema;
  estado: EstadoReporte;
  prioridad: NivelPrioridad;
  fechaCreacion: Date;
};

export function RecentReports({ reportes }: { reportes: ReporteItem[] }) {
  return (
    <section className="flex flex-col gap-md max-lg:gap-sm">
      <div className="flex items-end justify-between gap-md">
        <div>
          <h2 className="font-titulo-seccion text-titulo-seccion text-primary max-lg:text-[21px]">Reportes recientes</h2>
          <p className="mt-xs text-sm text-on-surface-variant max-lg:text-[13px]">Últimos puntos registrados por la comunidad.</p>
        </div>
        <Link className="shrink-0 font-etiqueta text-etiqueta font-semibold text-safety-blue hover:text-primary max-lg:rounded-full max-lg:bg-blue-50 max-lg:px-sm max-lg:py-xs" href="/reportes">
          Ver todos
        </Link>
      </div>
      <Card className="overflow-hidden max-lg:rounded-[18px] max-lg:shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
        {reportes.length === 0 ? (
          <p className="p-md text-on-surface-variant">No se encontraron reportes con los filtros seleccionados.</p>
        ) : (
          reportes.map((reporte, index) => (
            <Link
              href={`/reportes/${reporte.id}`}
              key={reporte.id}
              className="flex items-center gap-md border-b border-slate-100 p-md transition-colors last:border-b-0 hover:bg-amber-50/60 max-lg:gap-sm max-lg:p-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-safety-blue ring-1 ring-blue-100 max-lg:h-10 max-lg:w-10 max-lg:rounded-xl">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-subtitulo text-[17px] font-semibold text-primary max-lg:text-[15px]">{reporte.direccion}</h3>
                <p className="truncate text-sm text-on-surface-variant max-lg:text-[12px]">
                  {formatearFechaHora(reporte.fechaCreacion)} · {etiquetasTipoProblema[reporte.tipoProblema]}
                </p>
              </div>
              <Badge destacado={reporte.prioridad === "ALTA" && index === 0}>
                {reporte.prioridad === "ALTA" ? "Crítico" : etiquetasEstadoReporte[reporte.estado] ?? etiquetasPrioridad[reporte.prioridad]}
              </Badge>
            </Link>
          ))
        )}
      </Card>
    </section>
  );
}
