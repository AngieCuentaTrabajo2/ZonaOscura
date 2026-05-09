"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const quickPoints = [
  { label: "Pachacámac", lat: -12.2296, lng: -76.8614, left: 30, top: 44 },
  { label: "Manchay", lat: -12.1129, lng: -76.8832, left: 54, top: 30 },
  { label: "José Gálvez", lat: -12.2015, lng: -76.9348, left: 70, top: 58 }
];

export function LocationPicker({
  latitud,
  longitud,
  onChange
}: {
  latitud?: number;
  longitud?: number;
  onChange?: (latitud: number, longitud: number) => void;
}) {
  const [lat, setLat] = useState(latitud ?? -12.2296);
  const [lng, setLng] = useState(longitud ?? -76.8614);

  function setLocation(nextLat: number, nextLng: number) {
    setLat(nextLat);
    setLng(nextLng);
    onChange?.(nextLat, nextLng);
  }

  function usarUbicacionActual() {
    navigator.geolocation?.getCurrentPosition((position) => {
      setLocation(position.coords.latitude, position.coords.longitude);
    });
  }

  return (
    <div className="space-y-md">
      <div className="grid grid-cols-1 gap-md sm:grid-cols-[auto_1fr_1fr]">
        <Button type="button" variante="secundario" onClick={usarUbicacionActual}>
          <span className="material-symbols-outlined text-[18px]">my_location</span>
          Detectar ubicación
        </Button>
        <Input
          name="latitud"
          value={lat}
          onChange={(e) => setLocation(Number(e.target.value), lng)}
          aria-label="Latitud"
        />
        <Input
          name="longitud"
          value={lng}
          onChange={(e) => setLocation(lat, Number(e.target.value))}
          aria-label="Longitud"
        />
      </div>
      <div className="relative h-[260px] w-full overflow-hidden rounded-lg border border-outline-variant bg-[#eef4f7]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute left-[10%] top-0 h-full w-[8px] rotate-[12deg] bg-white shadow-sm" />
        <div className="absolute left-[48%] top-[-10%] h-[120%] w-[10px] -rotate-[16deg] bg-white shadow-sm" />
        <div className="absolute left-0 top-[32%] h-[9px] w-full -rotate-[4deg] bg-white shadow-sm" />
        <div className="absolute left-0 top-[70%] h-[9px] w-full rotate-[3deg] bg-white shadow-sm" />

        {quickPoints.map((point) => {
          const active = Math.abs(point.lat - lat) < 0.0001 && Math.abs(point.lng - lng) < 0.0001;
          return (
            <button
              key={point.label}
              type="button"
              onClick={() => setLocation(point.lat, point.lng)}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${point.left}%`, top: `${point.top}%` }}
              title={point.label}
            >
              <span className={`material-symbols-outlined fill text-[34px] ${active ? "text-amber-500" : "text-primary"}`}>
                location_on
              </span>
            </button>
          );
        })}

        <div className="absolute bottom-sm left-sm rounded-lg border border-slate-200 bg-white/92 p-sm text-xs text-on-surface-variant shadow-sm">
          Selecciona una zona sugerida o usa tu ubicación actual.
        </div>
      </div>
    </div>
  );
}
