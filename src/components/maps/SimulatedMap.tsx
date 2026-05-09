import type { EstadoReporte, NivelPrioridad } from "@prisma/client";
import { cn } from "@/lib/utils";

type MapPoint = {
  id: string;
  codigo?: string;
  direccion: string;
  distrito: string;
  estado: EstadoReporte;
  prioridad: NivelPrioridad;
  latitud?: number;
  longitud?: number;
};

const estadoStyles: Record<EstadoReporte, string> = {
  PENDIENTE: "bg-amber-400 text-primary ring-amber-200",
  EN_EVALUACION: "bg-blue-500 text-white ring-blue-200",
  EN_PROCESO: "bg-cyan-500 text-white ring-cyan-200",
  ATENDIDO: "bg-emerald-500 text-white ring-emerald-200",
  RECHAZADO: "bg-slate-500 text-white ring-slate-200"
};

const prioridadSize: Record<NivelPrioridad, string> = {
  BAJA: "h-7 w-7",
  MEDIA: "h-8 w-8",
  ALTA: "h-10 w-10"
};

export function SimulatedMap({
  reportes,
  selectedId,
  className,
  compact = false
}: {
  reportes: MapPoint[];
  selectedId?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("relative min-h-[420px] overflow-hidden rounded-lg border border-outline-variant bg-[#eef4f7]", compact && "min-h-[240px]", className)}>
      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-[8%] top-0 h-full w-[8px] rotate-[12deg] bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.08)]" />
        <div className="absolute left-[34%] top-[-10%] h-[120%] w-[10px] -rotate-[18deg] bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.08)]" />
        <div className="absolute left-[66%] top-[-8%] h-[120%] w-[8px] rotate-[8deg] bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.08)]" />
        <div className="absolute left-0 top-[18%] h-[9px] w-full -rotate-[4deg] bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.08)]" />
        <div className="absolute left-0 top-[47%] h-[10px] w-full rotate-[2deg] bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.08)]" />
        <div className="absolute left-0 top-[76%] h-[8px] w-full -rotate-[7deg] bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.08)]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:38px_38px]" />
      <div className="absolute left-[6%] top-[10%] rounded-lg bg-white/80 px-sm py-xs text-xs font-semibold text-slate-500 shadow-sm">Av. Principal</div>
      <div className="absolute bottom-[12%] right-[8%] rounded-lg bg-white/80 px-sm py-xs text-xs font-semibold text-slate-500 shadow-sm">Zona residencial</div>

      {reportes.slice(0, compact ? 4 : 10).map((reporte, index) => {
        const position = getPosition(reporte, index);
        const selected = selectedId ? reporte.id === selectedId : index === 0;
        return (
          <div
            key={reporte.id}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${position.left}%`, top: `${position.top}%` }}
            title={reporte.direccion}
          >
            <div
              className={cn(
                "flex items-center justify-center rounded-full ring-4 shadow-[0_10px_24px_rgba(15,23,42,0.22)] transition-transform",
                estadoStyles[reporte.estado],
                prioridadSize[reporte.prioridad],
                selected && "scale-125 ring-amber-100"
              )}
            >
              <span className="material-symbols-outlined fill text-[20px]">location_on</span>
            </div>
            {selected && !compact ? (
              <div className="absolute left-1/2 top-full mt-sm w-[210px] -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-sm text-left shadow-xl">
                <p className="truncate text-xs font-bold text-primary">{reporte.codigo ?? "Reporte"}</p>
                <p className="mt-xs line-clamp-2 text-sm font-semibold text-on-surface">{reporte.direccion}</p>
                <p className="mt-xs text-xs text-on-surface-variant">{reporte.distrito} · prioridad {reporte.prioridad.toLowerCase()}</p>
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="absolute bottom-sm left-sm flex flex-wrap gap-xs rounded-lg border border-slate-200 bg-white/92 p-sm text-xs shadow-sm">
        <Legend color="bg-amber-400" label="Pendiente" />
        <Legend color="bg-blue-500" label="Evaluación" />
        <Legend color="bg-emerald-500" label="Atendido" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-xs text-slate-600">
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
      {label}
    </span>
  );
}

function getPosition(reporte: MapPoint, index: number) {
  if (typeof reporte.latitud === "number" && typeof reporte.longitud === "number") {
    const left = 10 + Math.abs(((reporte.longitud + 77.02) * 700) % 78);
    const top = 14 + Math.abs(((reporte.latitud + 12.35) * 820) % 68);
    return { left, top };
  }

  const fallback = [
    { left: 28, top: 42 },
    { left: 52, top: 28 },
    { left: 70, top: 52 },
    { left: 38, top: 68 },
    { left: 18, top: 24 },
    { left: 82, top: 30 }
  ];
  return fallback[index % fallback.length];
}
