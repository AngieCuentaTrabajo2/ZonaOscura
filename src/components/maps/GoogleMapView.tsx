"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import type { ReporteZonaOscura } from "@prisma/client";
import { centroLimaSur } from "@/lib/googleMaps";
import { SimulatedMap } from "@/components/maps/SimulatedMap";

export function GoogleMapView({ reportes }: { reportes: ReporteZonaOscura[] }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""
  });

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || !isLoaded) {
    return <SimulatedMap reportes={reportes} />;
  }

  return (
    <GoogleMap center={centroLimaSur} zoom={12} mapContainerClassName="h-full min-h-[420px] w-full rounded-lg">
      {reportes.map((reporte) => (
        <Marker key={reporte.id} position={{ lat: reporte.latitud, lng: reporte.longitud }} title={reporte.direccion} />
      ))}
    </GoogleMap>
  );
}
