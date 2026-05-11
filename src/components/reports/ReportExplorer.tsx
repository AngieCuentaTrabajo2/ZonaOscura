"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { ReporteZonaOscura } from "@prisma/client";
import { PriorityList } from "@/components/municipal/PriorityList";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { etiquetasEstadoReporte, etiquetasPrioridad, etiquetasTipoProblema } from "@/lib/utils";

type ReporteConConteo = ReporteZonaOscura & { _count?: { confirmaciones: number } };

const GoogleMapView = dynamic(() => import("@/components/maps/GoogleMapView").then((mod) => mod.GoogleMapView), {
  ssr: false,
  loading: () => <div className="theme-surface min-h-[420px] rounded-2xl bg-surface-container-low" />
});

const controlClass = "theme-control rounded-xl focus:border-amber-300 focus:ring-amber-300/35";

export function ReportExplorer({
  reportes,
  mode = "table"
}: {
  reportes: ReporteConConteo[];
  mode?: "table" | "map" | "priority";
}) {
  const [query, setQuery] = useState("");
  const [distrito, setDistrito] = useState("");
  const [estado, setEstado] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [tipo, setTipo] = useState("");

  const distritos = useMemo(() => Array.from(new Set(reportes.map((reporte) => reporte.distrito))).sort(), [reportes]);
  const filtrados = useMemo(() => {
    const texto = query.trim().toLowerCase();
    return reportes.filter((reporte) => {
      const matchesText =
        !texto ||
        [reporte.codigo, reporte.direccion, reporte.distrito, reporte.descripcion].join(" ").toLowerCase().includes(texto);
      return (
        matchesText &&
        (!distrito || reporte.distrito === distrito) &&
        (!estado || reporte.estado === estado) &&
        (!prioridad || reporte.prioridad === prioridad) &&
        (!tipo || reporte.tipoProblema === tipo)
      );
    });
  }, [distrito, estado, prioridad, query, reportes, tipo]);

  return (
    <div className="flex flex-col gap-lg">
      <Card className="theme-surface grid grid-cols-1 gap-md rounded-2xl p-md ring-1 ring-white/[0.04] lg:grid-cols-5">
        <div className="relative">
          <span className="theme-accent material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-safety-blue">
            search
          </span>
          <Input
            className={`${controlClass} pl-10`}
            placeholder="Buscar código, dirección o distrito..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <Select className={controlClass} value={distrito} onChange={(event) => setDistrito(event.target.value)}>
          <option value="">Todos los distritos</option>
          {distritos.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select className={controlClass} value={estado} onChange={(event) => setEstado(event.target.value)}>
          <option value="">Todos los estados</option>
          {Object.entries(etiquetasEstadoReporte).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Select className={controlClass} value={prioridad} onChange={(event) => setPrioridad(event.target.value)}>
          <option value="">Todas las prioridades</option>
          {Object.entries(etiquetasPrioridad).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Select className={controlClass} value={tipo} onChange={(event) => setTipo(event.target.value)}>
          <option value="">Todos los problemas</option>
          {Object.entries(etiquetasTipoProblema).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </Card>

      <div className="theme-text-muted flex flex-wrap items-center justify-between gap-sm text-sm text-on-surface-variant">
        <span>
          {filtrados.length} de {reportes.length} reportes visibles
        </span>
        {query || distrito || estado || prioridad || tipo ? (
          <button
            type="button"
            className="theme-accent font-semibold text-safety-blue hover:text-primary"
            onClick={() => {
              setQuery("");
              setDistrito("");
              setEstado("");
              setPrioridad("");
              setTipo("");
            }}
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      {filtrados.length ? (
        mode === "map" ? (
          <div className="grid min-h-[600px] grid-cols-1 gap-lg lg:grid-cols-3">
            <Card className="theme-surface overflow-hidden rounded-2xl p-sm lg:col-span-2">
              <GoogleMapView reportes={filtrados} />
            </Card>
            <MapSummary reportes={filtrados} />
          </div>
        ) : mode === "priority" ? (
          <PriorityList reportes={filtrados.map((reporte) => ({ ...reporte, _count: reporte._count ?? { confirmaciones: 0 } })) as any} />
        ) : (
          <ReportsTable reportes={filtrados} />
        )
      ) : (
        <Card className="theme-surface rounded-2xl p-xl text-center">
          <span className="theme-text-muted material-symbols-outlined text-[40px] text-on-surface-variant">search_off</span>
          <h3 className="theme-text-primary mt-sm font-subtitulo text-subtitulo text-primary">No hay reportes para estos filtros</h3>
          <p className="theme-text-muted mt-xs text-on-surface-variant">Prueba con otro distrito, estado o palabra de búsqueda.</p>
        </Card>
      )}
    </div>
  );
}

function MapSummary({ reportes }: { reportes: ReporteConConteo[] }) {
  const primero = reportes[0];

  return (
    <Card className="theme-surface rounded-2xl p-md">
      <h2 className="theme-text-primary border-b border-outline-variant pb-sm font-titulo-seccion text-titulo-seccion text-primary">
        Resumen filtrado
      </h2>
      <div className="mt-md grid grid-cols-2 gap-sm text-sm">
        <SummaryTile tone="blue" value={reportes.length} label="reportes" />
        <SummaryTile tone="amber" value={reportes.filter((r) => r.prioridad === "ALTA").length} label="alta prioridad" />
        <SummaryTile tone="green" value={reportes.filter((r) => r.estado === "ATENDIDO").length} label="atendidos" />
        <SummaryTile tone="rose" value={reportes.filter((r) => r.estado === "PENDIENTE").length} label="pendientes" />
      </div>
      {primero ? (
        <div className="theme-surface mt-md rounded-2xl border border-outline-variant bg-white p-md">
          <p className="theme-text-muted font-etiqueta text-etiqueta font-semibold uppercase text-on-surface-variant">
            Primer resultado
          </p>
          <h3 className="theme-text-primary mt-xs font-subtitulo text-[17px] font-semibold text-primary">{primero.direccion}</h3>
          <p className="theme-text-muted mt-xs text-sm text-on-surface-variant">
            {primero.distrito} · {etiquetasTipoProblema[primero.tipoProblema]}
          </p>
        </div>
      ) : null}
    </Card>
  );
}

function SummaryTile({ value, label, tone }: { value: number; label: string; tone: "blue" | "amber" | "green" | "rose" }) {
  const styles = {
    blue: "theme-tile-blue bg-blue-50 text-safety-blue",
    amber: "theme-tile-amber bg-amber-50 text-amber-700",
    green: "theme-tile-green bg-emerald-50 text-safety-green",
    rose: "theme-tile-rose bg-rose-50 text-safety-rose"
  };

  return (
    <div className={`rounded-xl p-sm ${styles[tone]}`}>
      <strong className="text-[18px]">{value}</strong>
      <br />
      {label}
    </div>
  );
}
