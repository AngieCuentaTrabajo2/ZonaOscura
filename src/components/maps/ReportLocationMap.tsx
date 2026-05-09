"use client";

import type { ReporteZonaOscura } from "@prisma/client";
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup } from "@/components/ui/map";

export function ReportLocationMap({ reporte }: { reporte: Pick<ReporteZonaOscura, "latitud" | "longitud" | "direccion" | "codigo" | "distrito"> }) {
  return (
    <div className="h-[240px] overflow-hidden rounded-lg border border-outline-variant bg-slate-100">
      <Map center={[reporte.longitud, reporte.latitud]} zoom={14} theme="light">
        <MapControls position="top-right" showZoom showCompass />
        <MapMarker longitude={reporte.longitud} latitude={reporte.latitud}>
          <MarkerContent>
            <span className="material-symbols-outlined fill text-[38px] text-amber-500 drop-shadow-lg">location_on</span>
          </MarkerContent>
          <MarkerPopup>
            <div className="rounded-lg border border-slate-200 bg-white p-sm text-sm shadow-xl">
              <p className="font-bold text-primary">{reporte.codigo}</p>
              <p className="mt-xs text-on-surface">{reporte.direccion}</p>
              <p className="mt-xs text-xs text-on-surface-variant">{reporte.distrito}</p>
            </div>
          </MarkerPopup>
        </MapMarker>
      </Map>
    </div>
  );
}
