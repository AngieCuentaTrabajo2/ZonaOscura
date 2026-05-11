import Link from "next/link";
import { Card } from "@/components/ui/Card";

const actions = [
  { href: "/mapa", label: "Ver mapa", detail: "Consultar puntos críticos", icon: "map", color: "bg-blue-50 text-safety-blue ring-blue-100" },
  { href: "/reportes/nuevo", label: "Registrar reporte", detail: "Ubicación, foto y comentario", icon: "add_circle", color: "bg-amber-50 text-amber-600 ring-amber-100" },
  { href: "/municipal/informes", label: "Generar informe", detail: "Resumen operativo en PDF", icon: "assessment", color: "bg-emerald-50 text-safety-green ring-emerald-100" },
  { href: "/municipal/prioridades", label: "Ver prioridades", detail: "Casos por riesgo e incidencia", icon: "priority_high", color: "bg-rose-50 text-safety-rose ring-rose-100" }
];

export function QuickActions() {
  return (
    <section className="flex flex-col gap-md max-lg:gap-sm">
      <div>
        <h2 className="font-titulo-seccion text-titulo-seccion text-primary max-lg:text-[21px]">Accesos rápidos</h2>
        <p className="mt-xs text-sm text-on-surface-variant max-lg:text-[13px]">Flujos principales para ciudadanía y municipalidad.</p>
      </div>
      <div className="flex flex-col gap-sm">
        {actions.map((action) => (
          <Card key={action.href} className="transition-all hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_16px_35px_rgba(15,23,42,0.12)] max-lg:rounded-[18px]">
            <Link href={action.href} className="flex w-full items-center justify-between gap-md p-md max-lg:p-sm">
              <div className="flex min-w-0 items-center gap-md max-lg:gap-sm">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ring-1 max-lg:rounded-xl ${action.color}`}>
                  <span className="material-symbols-outlined">{action.icon}</span>
                </div>
                <div className="min-w-0">
                  <span className="block truncate font-subtitulo text-[16px] font-semibold text-primary max-lg:text-[15px]">{action.label}</span>
                  <span className="block truncate text-sm text-on-surface-variant max-lg:text-[12px]">{action.detail}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-amber-500">arrow_forward</span>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
