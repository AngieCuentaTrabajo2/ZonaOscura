import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export type StatsCardProps = {
  titulo: string;
  valor: number | string;
  descripcion?: string;
  icono?: React.ReactNode;
  destacado?: boolean;
  tono?: "azul" | "ambar" | "verde" | "rojo";
};

const tonos = {
  azul: "border-blue-200 bg-gradient-to-br from-white to-blue-50 text-safety-blue",
  ambar: "border-amber-200 bg-gradient-to-br from-white to-amber-50 text-amber-600",
  verde: "border-green-200 bg-gradient-to-br from-white to-emerald-50 text-safety-green",
  rojo: "border-rose-200 bg-gradient-to-br from-white to-rose-50 text-safety-rose"
};

export function StatsCard({ titulo, valor, descripcion, icono, destacado, tono = "azul" }: StatsCardProps) {
  return (
    <Card
      className={cn(
        "group flex min-h-[144px] flex-col justify-between overflow-hidden p-md transition-transform hover:-translate-y-0.5 max-lg:min-h-[118px] max-lg:rounded-[18px] max-lg:p-sm",
        destacado
          ? "border-amber-300 bg-gradient-to-br from-primary via-slate-900 to-slate-950 text-on-primary shadow-[0_18px_42px_rgba(15,23,42,0.22)]"
          : tonos[tono]
      )}
    >
      <div className="flex items-start justify-between gap-md max-lg:gap-sm">
        <span className={cn("font-etiqueta text-etiqueta font-semibold uppercase max-lg:text-[11px]", destacado ? "text-amber-100" : "text-slate-600")}>
          {titulo}
        </span>
        <span className={cn("rounded-lg p-xs transition-transform group-hover:scale-105 max-lg:rounded-xl", destacado ? "bg-amber-400 text-primary" : "bg-white/85")}>
          {icono}
        </span>
      </div>
      <div>
        <span className={cn("font-titulo-principal text-[34px] leading-none max-lg:text-[30px]", destacado ? "text-on-primary" : "text-primary")}>
          {valor}
        </span>
        <p className={cn("mt-xs text-sm max-lg:text-[12px] max-lg:leading-4", destacado ? "text-on-primary/75" : "text-on-surface-variant")}>
          {descripcion ?? "Indicador actualizado"}
        </p>
      </div>
    </Card>
  );
}
