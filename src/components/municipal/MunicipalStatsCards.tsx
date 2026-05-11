import { KpiCard } from "@/components/dashboard/KpiCard";

export function MunicipalStatsCards({
  data
}: {
  data: { total: number; pendientes: number; evaluacion?: number; atendidos: number; criticos?: number };
}) {
  return (
    <div className="grid grid-cols-2 gap-sm md:grid-cols-2 lg:grid-cols-4 lg:gap-gutter">
      <KpiCard
        title="Reportes recibidos"
        value={data.total}
        description="Casos ciudadanos registrados"
        tone="blue"
        icon={<span className="material-symbols-outlined text-[22px]">inbox</span>}
      />
      <KpiCard
        title="Pendientes"
        value={data.pendientes}
        description="Requieren revisión municipal"
        tone="amber"
        icon={<span className="material-symbols-outlined text-[22px]">pending_actions</span>}
      />
      <KpiCard
        title="Atendidos"
        value={data.atendidos}
        description="Intervenciones cerradas"
        tone="green"
        icon={<span className="material-symbols-outlined text-[22px]">task_alt</span>}
      />
      <KpiCard
        title="Zonas críticas"
        value={data.criticos ?? data.evaluacion ?? 0}
        description="Casos de alta prioridad"
        critical
        icon={<span className="material-symbols-outlined text-[23px]">warning</span>}
      />
    </div>
  );
}
