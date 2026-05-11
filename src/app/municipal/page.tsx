import Link from "next/link";
import { MunicipalStatsCards } from "@/components/municipal/MunicipalStatsCards";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { Card } from "@/components/ui/Card";
import { obtenerDashboardMunicipal } from "@/features/municipal/municipal.service";
import { obtenerMetricasDemo, obtenerResumenDistritosDemo, reportesDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function MunicipalPage() {
  const metricasDemo = obtenerMetricasDemo(reportesDemo);
  let data: any = {
    total: metricasDemo.total,
    pendientes: metricasDemo.pendientes,
    evaluacion: reportesDemo.filter((reporte) => reporte.estado === "EN_EVALUACION").length,
    atendidos: metricasDemo.atendidos,
    porDistrito: obtenerResumenDistritosDemo(reportesDemo),
    ultimos: reportesDemo
  };

  try {
    data = await obtenerDashboardMunicipal();
  } catch {}

  const criticos = data.criticos ?? metricasDemo.criticos;

  return (
    <div className="flex flex-col gap-xl max-lg:gap-lg">
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[linear-gradient(135deg,#111827_0%,#0f172a_52%,#0D1117_100%)] p-lg text-white shadow-[0_18px_48px_rgba(15,23,42,0.18)] max-lg:p-md">
        <p className="font-etiqueta text-etiqueta font-semibold uppercase text-amber-200">Gestión municipal</p>
        <h1 className="mt-xs font-titulo-principal text-titulo-principal text-white max-lg:text-[30px]">Panel municipal</h1>
        <p className="mt-xs max-w-3xl text-blue-100 max-lg:text-[14px] max-lg:leading-6">
          Indicadores para revisar reportes, evitar duplicidad de intervención y priorizar mantenimiento de alumbrado público.
        </p>
      </section>

      <MunicipalStatsCards data={{ ...data, criticos }} />
      <MunicipalInsightBar data={{ ...data, criticos }} />

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <Card className="rounded-2xl p-lg max-lg:border-slate-700/70 max-lg:bg-[#111827]/82 max-lg:p-md lg:col-span-5">
          <h2 className="font-subtitulo text-subtitulo text-primary max-lg:text-white">Resumen por distrito</h2>
          <div className="mt-md space-y-md">
            {data.porDistrito.map((item: any) => (
              <div key={item.distrito}>
                <div className="flex justify-between gap-md text-sm max-lg:text-slate-300">
                  <span>{item.distrito}</span>
                  <strong className="max-lg:text-white">{item._count} reportes</strong>
                </div>
                <div className="mt-xs h-2 overflow-hidden rounded-full bg-surface-container max-lg:bg-slate-800">
                  <div className="h-full rounded-full bg-safety-blue" style={{ width: `${Math.min(100, item._count * 20)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl p-lg max-lg:border-slate-700/70 max-lg:bg-[#111827]/82 max-lg:p-md lg:col-span-3">
          <h2 className="font-subtitulo text-subtitulo text-primary max-lg:text-white">Acciones rápidas</h2>
          <div className="mt-md flex flex-col gap-md">
            <Link className="rounded-xl bg-primary px-md py-sm text-center font-semibold text-on-primary shadow-[0_10px_26px_rgba(15,23,42,0.16)]" href="/municipal/prioridades">
              Ver prioridades
            </Link>
            <Link className="rounded-xl border border-outline-variant bg-white px-md py-sm text-center font-semibold text-primary hover:bg-surface-container-low" href="/municipal/informes">
              Generar informe
            </Link>
          </div>
        </Card>

        <div className="lg:col-span-4">
          <RecentReports reportes={data.ultimos.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}

function MunicipalInsightBar({ data }: { data: any }) {
  const total = Math.max(1, data.total ?? 0);
  const pendientePct = Math.round(((data.pendientes ?? 0) / total) * 100);
  const atendidoPct = Math.round(((data.atendidos ?? 0) / total) * 100);

  return (
    <section className="grid grid-cols-3 gap-xs rounded-2xl border border-white/10 bg-white/[0.05] p-sm shadow-[0_16px_38px_rgba(2,6,23,0.22)] ring-1 ring-white/[0.04] lg:hidden">
      <MiniInsight label="Pendiente" value={`${pendientePct}%`} icon="pending_actions" />
      <MiniInsight label="Atendido" value={`${atendidoPct}%`} icon="task_alt" />
      <MiniInsight label="Crítico" value={data.criticos ?? 0} icon="warning" accent />
    </section>
  );
}

function MiniInsight({ label, value, icon, accent = false }: { label: string; value: number | string; icon: string; accent?: boolean }) {
  return (
    <div className="rounded-xl bg-[#111827]/70 p-sm">
      <span className={accent ? "material-symbols-outlined text-[18px] text-orange-300" : "material-symbols-outlined text-[18px] text-amber-300"}>
        {icon}
      </span>
      <p className="mt-xs text-[18px] font-bold text-white">{value}</p>
      <p className="text-[11px] font-semibold text-slate-400">{label}</p>
    </div>
  );
}
