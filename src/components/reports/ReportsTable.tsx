import Link from "next/link";
import type { ReporteZonaOscura } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { Table, Td, Th } from "@/components/ui/Table";
import { ReportStatusBadge } from "@/components/reports/ReportStatusBadge";
import { etiquetasTipoProblema, formatearFecha } from "@/lib/utils";

export function ReportsTable({ reportes }: { reportes: ReporteZonaOscura[] }) {
  return (
    <Card className="overflow-hidden rounded-2xl max-lg:border-slate-700/70 max-lg:bg-[#111827]/82">
      <div className="hidden overflow-x-auto lg:block">
        <Table>
          <thead className="border-b border-outline-variant bg-slate-50">
            <tr>
              <Th>Código</Th>
              <Th>Dirección</Th>
              <Th>Distrito</Th>
              <Th>Problema</Th>
              <Th>Fecha</Th>
              <Th>Estado</Th>
              <Th className="text-right">Acción</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {reportes.map((reporte) => (
              <tr key={reporte.id} className="hover:bg-amber-50/50">
                <Td className="font-mono font-semibold text-primary">{reporte.codigo}</Td>
                <Td>{reporte.direccion}</Td>
                <Td>{reporte.distrito}</Td>
                <Td>{etiquetasTipoProblema[reporte.tipoProblema]}</Td>
                <Td className="text-on-surface-variant">{formatearFecha(reporte.fechaCreacion)}</Td>
                <Td>
                  <ReportStatusBadge estado={reporte.estado} />
                </Td>
                <Td className="text-right">
                  <Link href={`/reportes/${reporte.id}`} className="font-semibold text-safety-blue hover:text-primary">
                    Ver detalle
                  </Link>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="grid grid-cols-1 gap-md p-md lg:hidden">
        {reportes.map((reporte) => (
          <ReportCardLike key={reporte.id} reporte={reporte} />
        ))}
      </div>
    </Card>
  );
}

function ReportCardLike({ reporte }: { reporte: ReporteZonaOscura }) {
  return (
    <div className="rounded-2xl border border-outline-variant bg-white p-md max-lg:border-slate-700 max-lg:bg-white/[0.06]">
      <div className="flex items-start justify-between gap-md">
        <div className="min-w-0">
          <p className="font-mono text-[12px] font-semibold text-slate-500 max-lg:text-slate-400">{reporte.codigo}</p>
          <h3 className="mt-xs font-subtitulo text-[17px] font-semibold text-primary max-lg:text-white">{reporte.direccion}</h3>
          <p className="mt-xs text-sm text-on-surface-variant max-lg:text-slate-400">{reporte.distrito}</p>
        </div>
        <ReportStatusBadge estado={reporte.estado} />
      </div>
      <div className="mt-md flex items-center justify-between gap-md border-t border-outline-variant pt-sm max-lg:border-slate-700">
        <span className="text-sm text-on-surface-variant max-lg:text-slate-300">{etiquetasTipoProblema[reporte.tipoProblema]}</span>
        <Link href={`/reportes/${reporte.id}`} className="text-sm font-semibold text-safety-blue max-lg:text-amber-300">
          Ver detalle
        </Link>
      </div>
    </div>
  );
}
