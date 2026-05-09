import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export function InformePreview() {
  return (
    <Card className="overflow-hidden">
      <div className="bg-slate-950 p-lg text-white">
        <p className="font-etiqueta text-etiqueta font-semibold uppercase text-amber-200">Vista previa</p>
        <h2 className="mt-xs font-subtitulo text-subtitulo text-white">Informe operativo</h2>
        <p className="mt-xs text-sm text-blue-100">Resumen priorizado para mantenimiento e instalación de luminarias.</p>
      </div>
      <div className="p-lg">
        <div className="rounded-lg border border-outline-variant bg-white p-md">
          <div className="border-b border-outline-variant pb-sm">
            <p className="text-xs font-bold uppercase text-safety-blue">Municipalidad · Servicios públicos</p>
            <h3 className="mt-xs font-subtitulo text-[18px] font-semibold text-primary">Informe operativo de zonas oscuras</h3>
          </div>
          <div className="mt-md grid grid-cols-2 gap-sm text-sm">
            <PreviewMetric label="Periodo" value="Mayo 2026" />
            <PreviewMetric label="Distrito" value="Todos" />
            <PreviewMetric label="Críticos" value="10" />
            <PreviewMetric label="Pendientes" value="46" />
          </div>
          <div className="mt-md rounded-lg bg-amber-50 p-md text-sm text-amber-900">
            Recomendación: iniciar intervención por zonas con riesgo alto, mayor número de confirmaciones y reportes recientes.
          </div>
        </div>

        <div className="mt-md space-y-sm text-sm">
          <label className="flex gap-sm"><input type="checkbox" defaultChecked /> Resumen ejecutivo</label>
          <label className="flex gap-sm"><input type="checkbox" defaultChecked /> Tabla de prioridades</label>
          <label className="flex gap-sm"><input type="checkbox" defaultChecked /> Reportes pendientes y atendidos</label>
          <label className="flex gap-sm"><input type="checkbox" defaultChecked /> Recomendación operativa</label>
          <label className="flex gap-sm"><input type="checkbox" /> Evidencia fotográfica</label>
        </div>
        <a href="/api/informes" target="_blank" className="mt-md block">
          <Button className="w-full" type="button">
            <span className="material-symbols-outlined">download</span>
            Descargar PDF
          </Button>
        </a>
      </div>
    </Card>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface-container-low p-sm">
      <p className="text-xs text-on-surface-variant">{label}</p>
      <p className="font-semibold text-primary">{value}</p>
    </div>
  );
}
