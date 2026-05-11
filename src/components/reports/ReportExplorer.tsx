"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { EstadoReporte, NivelPrioridad, ReporteZonaOscura } from "@prisma/client";
import { PriorityList } from "@/components/municipal/PriorityList";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { etiquetasEstadoReporte, etiquetasPrioridad, etiquetasTipoProblema } from "@/lib/utils";

type ReporteConConteo = ReporteZonaOscura & { _count?: { confirmaciones: number } };

const GoogleMapView = dynamic(() => import("@/components/maps/GoogleMapView").then((mod) => mod.GoogleMapView), {
  ssr: false,
  loading: () => <div className="min-h-[420px] rounded-2xl bg-surface-container-low max-lg:bg-[#0D1117]" />
});

const darkControlClass =
  "rounded-xl max-lg:border-slate-700 max-lg:bg-[#0D1117] max-lg:text-slate-100 max-lg:placeholder:text-slate-400 max-lg:focus:border-amber-300 max-lg:focus:ring-amber-300/35";

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
      <Card className="grid grid-cols-1 gap-md rounded-2xl p-md max-lg:border-slate-700/70 max-lg:bg-[#111827]/82 max-lg:shadow-[0_16px_38px_rgba(2,6,23,0.28)] max-lg:ring-white/[0.04] lg:grid-cols-5">
        <div className="relative">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-safety-blue max-lg:text-amber-300">
            search
          </span>
          <Input
            className={`${darkControlClass} pl-10`}
            placeholder="Buscar código, dirección o distrito..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <Select className={darkControlClass} value={distrito} onChange={(event) => setDistrito(event.target.value)}>
          <option value="">Todos los distritos</option>
          {distritos.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select className={darkControlClass} value={estado} onChange={(event) => setEstado(event.target.value)}>
          <option value="">Todos los estados</option>
          {Object.entries(etiquetasEstadoReporte).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Select className={darkControlClass} value={prioridad} onChange={(event) => setPrioridad(event.target.value)}>
          <option value="">Todas las prioridades</option>
          {Object.entries(etiquetasPrioridad).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <Select className={darkControlClass} value={tipo} onChange={(event) => setTipo(event.target.value)}>
          <option value="">Todos los problemas</option>
          {Object.entries(etiquetasTipoProblema).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-sm text-sm text-on-surface-variant max-lg:text-slate-300">
        <span>
          {filtrados.length} de {reportes.length} reportes visibles
        </span>
        {query || distrito || estado || prioridad || tipo ? (
          <button
            type="button"
            className="font-semibold text-safety-blue hover:text-primary max-lg:text-amber-300 max-lg:hover:text-amber-200"
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
            <Card className="overflow-hidden rounded-2xl p-sm max-lg:border-slate-700/70 max-lg:bg-[#111827]/82 lg:col-span-2">
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
        <Card className="rounded-2xl p-xl text-center max-lg:border-slate-700/70 max-lg:bg-[#111827]/82">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant max-lg:text-slate-400">search_off</span>
          <h3 className="mt-sm font-subtitulo text-subtitulo text-primary max-lg:text-white">No hay reportes para estos filtros</h3>
          <p className="mt-xs text-on-surface-variant max-lg:text-slate-400">Prueba con otro distrito, estado o palabra de búsqueda.</p>
        </Card>
      )}
    </div>
  );
}

function MapSummary({ reportes }: { reportes: ReporteConConteo[] }) {
  const primero = reportes[0];

  return (
    <Card className="rounded-2xl p-md max-lg:border-slate-700/70 max-lg:bg-[#111827]/82 max-lg:text-slate-100">
      <h2 className="border-b border-outline-variant pb-sm font-titulo-seccion text-titulo-seccion text-primary max-lg:border-slate-700 max-lg:text-white">
        Resumen filtrado
      </h2>
      <div className="mt-md grid grid-cols-2 gap-sm text-sm">
        <SummaryTile tone="blue" value={reportes.length} label="reportes" />
        <SummaryTile tone="amber" value={reportes.filter((r) => r.prioridad === "ALTA").length} label="alta prioridad" />
        <SummaryTile tone="green" value={reportes.filter((r) => r.estado === "ATENDIDO").length} label="atendidos" />
        <SummaryTile tone="rose" value={reportes.filter((r) => r.estado === "PENDIENTE").length} label="pendientes" />
      </div>
      {primero ? (
        <div className="mt-md rounded-2xl border border-outline-variant bg-white p-md max-lg:border-slate-700 max-lg:bg-white/[0.06]">
          <p className="font-etiqueta text-etiqueta font-semibold uppercase text-on-surface-variant max-lg:text-slate-400">
            Primer resultado
          </p>
          <h3 className="mt-xs font-subtitulo text-[17px] font-semibold text-primary max-lg:text-white">{primero.direccion}</h3>
          <p className="mt-xs text-sm text-on-surface-variant max-lg:text-slate-300">
            {primero.distrito} · {etiquetasTipoProblema[primero.tipoProblema]}
          </p>
        </div>
      ) : null}
    </Card>
  );
}

function SummaryTile({ value, label, tone }: { value: number; label: string; tone: "blue" | "amber" | "green" | "rose" }) {
  const styles = {
    blue: "bg-blue-50 text-safety-blue max-lg:bg-blue-400/12 max-lg:text-blue-100",
    amber: "bg-amber-50 text-amber-700 max-lg:bg-amber-400/12 max-lg:text-amber-100",
    green: "bg-emerald-50 text-safety-green max-lg:bg-emerald-400/12 max-lg:text-emerald-100",
    rose: "bg-rose-50 text-safety-rose max-lg:bg-rose-400/12 max-lg:text-rose-100"
  };

  return (
    <div className={`rounded-xl p-sm ${styles[tone]}`}>
      <strong className="text-[18px]">{value}</strong>
      <br />
      {label}
    </div>
  );
}
