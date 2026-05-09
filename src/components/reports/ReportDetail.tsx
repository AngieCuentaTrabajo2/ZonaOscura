import type { Prisma } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReportStatusBadge } from "@/components/reports/ReportStatusBadge";
import { confirmarReporteAction } from "@/features/reportes/reporte.actions";
import { SimulatedMap } from "@/components/maps/SimulatedMap";
import { etiquetasTipoProblema, formatearFechaHora } from "@/lib/utils";

type ReporteDetalle = Prisma.ReporteZonaOscuraGetPayload<{
  include: {
    imagenes: true;
    comentarios: { include: { usuario: true } };
    confirmaciones: true;
    historialEstados: { include: { cambiadoPor: true } };
    intervenciones: true;
    ciudadano: true;
    funcionarioAsignado: true;
  };
}>;

export function ReportDetail({ reporte }: { reporte: ReporteDetalle }) {
  return (
    <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
      <section className="flex flex-col gap-lg lg:col-span-7">
        <Card className="overflow-hidden">
          <div className="bg-slate-950 p-lg text-white">
            <div className="flex flex-wrap items-start justify-between gap-md">
              <div>
                <p className="font-etiqueta text-etiqueta font-semibold uppercase text-amber-200">{reporte.codigo}</p>
                <h1 className="mt-xs font-titulo-seccion text-titulo-seccion text-white">{reporte.direccion}</h1>
                <p className="mt-xs text-sm text-blue-100">Reporte creado por {reporte.ciudadano.nombres} para seguimiento ciudadano y municipal.</p>
              </div>
              <div className="flex flex-wrap items-center gap-sm">
                <ReportStatusBadge estado={reporte.estado} prioridad={reporte.prioridad} />
                <span className="rounded-full bg-white/10 px-md py-xs font-subtitulo text-[15px] text-white">
                  {reporte.confirmaciones.length} confirmaciones
                </span>
              </div>
            </div>
          </div>

          <div className="p-lg">
            <div className="h-[320px] overflow-hidden rounded-lg border border-outline-variant bg-surface-variant">
              {reporte.imagenes[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={reporte.imagenes[0].urlImagen} alt="Fotografía del reporte" className="h-full w-full object-cover grayscale" />
              ) : (
                <div className="flex h-full items-center justify-center text-on-surface-variant">Sin fotografía</div>
              )}
            </div>
            <div className="mt-md grid grid-cols-1 gap-md sm:grid-cols-2">
              <Info label="Distrito" value={reporte.distrito} icon="location_city" />
              <Info label="Tipo" value={etiquetasTipoProblema[reporte.tipoProblema]} icon="report_problem" />
              <Info label="Riesgo" value={reporte.nivelRiesgo.toLowerCase()} icon="warning" />
              <Info label="Fecha" value={formatearFechaHora(reporte.fechaCreacion)} icon="schedule" />
            </div>
            <div className="mt-md rounded-r-lg border border-l-4 border-outline-variant border-l-primary bg-surface p-md">
              <p className="font-etiqueta text-etiqueta font-semibold uppercase text-on-surface-variant">Comentario ciudadano</p>
              <p className="mt-xs text-on-surface">{reporte.descripcion}</p>
            </div>
            <form action={confirmarReporteAction.bind(null, reporte.id)} className="mt-md">
              <Button type="submit">
                <span className="material-symbols-outlined text-[20px]">verified</span>
                Confirmar que sigue oscuro
              </Button>
            </form>
          </div>
        </Card>
      </section>

      <aside className="flex flex-col gap-lg lg:col-span-5">
        <Card className="p-lg">
          <h2 className="font-titulo-seccion text-titulo-seccion text-primary">Seguimiento municipal</h2>
          <div className="mt-md rounded-lg bg-primary-container p-md text-on-primary-container">
            <div className="flex justify-between gap-md border-b border-white/20 pb-sm">
              <span className="font-etiqueta font-semibold uppercase">Estado actual</span>
              <span className="text-right font-subtitulo">{reporte.estado.replaceAll("_", " ")}</span>
            </div>
            <div className="flex justify-between gap-md pt-sm">
              <span className="font-etiqueta font-semibold uppercase">Responsable</span>
              <span className="text-right">{reporte.funcionarioAsignado?.nombres ?? "Por asignar"}</span>
            </div>
          </div>
          <div className="mt-md">
            <SimulatedMap reportes={[reporte]} selectedId={reporte.id} compact />
          </div>
          <h3 className="mt-md font-subtitulo text-subtitulo">Historial de eventos</h3>
          <div className="mt-md space-y-md border-l-2 border-surface-container-highest pl-md">
            {reporte.historialEstados.length ? (
              reporte.historialEstados.map((item) => (
                <div key={item.id} className="relative">
                  <span className="absolute -left-[23px] top-1 h-3 w-3 rounded-full bg-amber-400 ring-4 ring-amber-100" />
                  <p className="font-semibold text-primary">{item.estadoNuevo.replaceAll("_", " ")}</p>
                  <p className="text-sm text-on-surface-variant">{formatearFechaHora(item.fechaCreacion)} · {item.cambiadoPor.nombres}</p>
                  {item.nota ? <p className="text-sm">{item.nota}</p> : null}
                </div>
              ))
            ) : (
              <p className="text-sm text-on-surface-variant">Sin eventos registrados todavía.</p>
            )}
          </div>
        </Card>

        <Card className="p-lg">
          <h2 className="font-subtitulo text-subtitulo text-primary">Criterios de prioridad</h2>
          <div className="mt-md grid grid-cols-1 gap-sm">
            <Criterion icon="priority_high" label="Riesgo reportado" value={reporte.nivelRiesgo} />
            <Criterion icon="groups" label="Confirmaciones ciudadanas" value={String(reporte.confirmaciones.length)} />
            <Criterion icon="engineering" label="Estado de intervención" value={reporte.estado.replaceAll("_", " ")} />
          </div>
        </Card>
      </aside>
    </div>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-lg border border-surface-container-highest bg-surface-container-low p-md">
      <span className="font-etiqueta text-etiqueta font-semibold uppercase text-on-surface-variant">{label}</span>
      <div className="mt-xs flex items-center gap-sm">
        <span className="material-symbols-outlined text-secondary">{icon}</span>
        <span className="font-subtitulo text-[16px] font-semibold capitalize text-on-surface">{value}</span>
      </div>
    </div>
  );
}

function Criterion({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-md rounded-lg border border-outline-variant bg-white p-sm">
      <div className="flex items-center gap-sm">
        <span className="material-symbols-outlined text-safety-blue">{icon}</span>
        <span className="text-sm text-on-surface-variant">{label}</span>
      </div>
      <strong className="text-sm capitalize text-primary">{value.toLowerCase()}</strong>
    </div>
  );
}
