import Link from "next/link";
import { Card } from "@/components/ui/Card";

const stories = [
  {
    code: "US01",
    title: "Reportar calle sin iluminación",
    user: "Vecina o junta vecinal",
    path: "/reportes/nuevo",
    icon: "add_location_alt"
  },
  {
    code: "US02",
    title: "Visualizar zonas oscuras en mapa",
    user: "Trabajador que transita de noche",
    path: "/mapa",
    icon: "map"
  },
  {
    code: "US03",
    title: "Ver historial de zonas atendidas",
    user: "Servicios públicos municipales",
    path: "/municipal/historial",
    icon: "history"
  },
  {
    code: "US04",
    title: "Generar informe priorizado",
    user: "Representante municipal",
    path: "/municipal/informes",
    icon: "assignment"
  }
];

export function UserStoriesMatrix() {
  return (
    <section className="flex flex-col gap-md">
      <div>
        <h2 className="font-titulo-seccion text-titulo-seccion text-primary">Cobertura de historias de usuario</h2>
        <p className="mt-xs text-sm text-on-surface-variant">Trazabilidad directa entre la actividad académica y las pantallas del prototipo.</p>
      </div>
      <div className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-4">
        {stories.map((story) => (
          <Card key={story.code} className="p-md transition-all hover:-translate-y-0.5 hover:border-blue-200">
            <div className="flex items-start justify-between gap-md">
              <span className="rounded-full bg-slate-950 px-sm py-xs text-xs font-bold text-amber-200">{story.code}</span>
              <span className="material-symbols-outlined text-safety-blue">{story.icon}</span>
            </div>
            <h3 className="mt-md min-h-[48px] font-subtitulo text-[17px] font-semibold text-primary">{story.title}</h3>
            <p className="mt-xs text-sm text-on-surface-variant">{story.user}</p>
            <Link href={story.path} className="mt-md inline-flex items-center gap-xs text-sm font-semibold text-safety-blue hover:text-primary">
              Ver pantalla
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
