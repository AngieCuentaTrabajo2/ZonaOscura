"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { EstadoReporte, NivelPrioridad, ReporteZonaOscura, TipoProblema } from "@prisma/client";
import { PriorityList } from "@/components/municipal/PriorityList";
import { ReportsTable } from "@/components/reports/ReportsTable";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { etiquetasEstadoReporte, etiquetasPrioridad, etiquetasTipoProblema } from "@/lib/utils";

type ReporteConConteo = ReporteZonaOscura & { _count?: { confirmaciones: number } };

const GoogleMapView = dynamic(() => import("@/components/maps/GoogleMapView").then((mod) => mod.GoogleMapView), {
  ssr: false,
  loading: () => <div className="min-h-[420px] rounded-lg bg-surface-container-low" />
});

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
      const matchesText = !texto || [reporte.codigo, reporte.direccion, reporte.distrito, reporte.descripcion]
        .join(" ")
        .toLowerCase()
        .includes(texto);
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
      <Card className="grid grid-cols-1 gap-md p-md lg:grid-cols-5">
        <Input placeholder="Buscar código, dirección o distrito..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <Select value={distrito} onChange={(event) => setDistrito(event.target.value)}>
          <option value="">Todos los distritos</option>
          {distritos.map((item) => <option key={item} value={item}>{item}</option>)}
        </Select>
        <Select value={estado} onChange={(event) => setEstado(event.target.value)}>
          <option value="">Todos los estados</option>
          {Object.entries(etiquetasEstadoReporte).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </Select>
        <Select value={prioridad} onChange={(event) => setPrioridad(event.target.value)}>
          <option value="">Todas las prioridades</option>
          {Object.entries(etiquetasPrioridad).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </Select>
        <Select value={tipo} onChange={(event) => setTipo(event.target.value)}>
          <option value="">Todos los problemas</option>
          {Object.entries(etiquetasTipoProblema).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </Select>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-sm text-sm text-on-surface-variant">
        <span>{filtrados.length} de {reportes.length} reportes visibles</span>
        {(query || distrito || estado || prioridad || tipo) ? (
          <button
            type="button"
            className="font-semibold text-safety-blue hover:text-primary"
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
            <Card className="overflow-hidden p-sm lg:col-span-2">
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
        <Card className="p-xl text-center">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant">search_off</span>
          <h3 className="mt-sm font-subtitulo text-subtitulo text-primary">No hay reportes para estos filtros</h3>
          <p className="mt-xs text-on-surface-variant">Prueba con otro distrito, estado o palabra de búsqueda.</p>
        </Card>
      )}
    </div>
  );
}

function MapSummary({ reportes }: { reportes: ReporteConConteo[] }) {
  const primero = reportes[0];
  return (
    <Card className="p-md">
      <h2 className="border-b border-outline-variant pb-sm font-titulo-seccion text-titulo-seccion text-primary">Resumen filtrado</h2>
      <div className="mt-md grid grid-cols-2 gap-sm text-sm">
        <div className="rounded-lg bg-blue-50 p-sm text-safety-blue"><strong>{reportes.length}</strong><br />reportes</div>
        <div className="rounded-lg bg-amber-50 p-sm text-amber-700"><strong>{reportes.filter((r) => r.prioridad === "ALTA").length}</strong><br />alta prioridad</div>
        <div className="rounded-lg bg-emerald-50 p-sm text-safety-green"><strong>{reportes.filter((r) => r.estado === "ATENDIDO").length}</strong><br />atendidos</div>
        <div className="rounded-lg bg-rose-50 p-sm text-safety-rose"><strong>{reportes.filter((r) => r.estado === "PENDIENTE").length}</strong><br />pendientes</div>
      </div>
      {primero ? (
        <div className="mt-md rounded-lg border border-outline-variant bg-white p-md">
          <p className="font-etiqueta text-etiqueta font-semibold uppercase text-on-surface-variant">Primer resultado</p>
          <h3 className="mt-xs font-subtitulo text-[17px] font-semibold text-primary">{primero.direccion}</h3>
          <p className="mt-xs text-sm text-on-surface-variant">{primero.distrito} · {etiquetasTipoProblema[primero.tipoProblema]}</p>
        </div>
      ) : null}
    </Card>
  );
}
