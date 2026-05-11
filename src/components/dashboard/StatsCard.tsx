import { KpiCard, type KpiTone } from "@/components/dashboard/KpiCard";

export type StatsCardProps = {
  titulo: string;
  valor: number | string;
  descripcion?: string;
  icono?: React.ReactNode;
  destacado?: boolean;
  tono?: "azul" | "ambar" | "verde" | "rojo";
};

const tonos: Record<NonNullable<StatsCardProps["tono"]>, KpiTone> = {
  azul: "blue",
  ambar: "amber",
  verde: "green",
  rojo: "rose"
};

export function StatsCard({ titulo, valor, descripcion, icono, destacado, tono = "azul" }: StatsCardProps) {
  return <KpiCard title={titulo} value={valor} description={descripcion} icon={icono} tone={tonos[tono]} critical={destacado} />;
}
