import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UserStoriesMatrix } from "@/components/dashboard/UserStoriesMatrix";
import { obtenerMetricasReportes, obtenerReportes } from "@/features/reportes/reporte.service";
import { obtenerMetricasDemo, reportesDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let reportes = reportesDemo;
  let metricas = obtenerMetricasDemo(reportesDemo);

  try {
    reportes = await obtenerReportes();
    metricas = await obtenerMetricasReportes();
  } catch {
    // El prototipo conserva datos coherentes si la base de datos no responde.
  }

  return (
    <div className="flex flex-col gap-lg lg:gap-xl">
      <section className="overflow-hidden rounded-lg border border-slate-900/10 bg-slate-950 text-white shadow-[0_24px_60px_rgba(15,23,42,0.20)] max-lg:rounded-[22px] max-lg:border-slate-800 max-lg:shadow-[0_18px_44px_rgba(15,23,42,0.24)]">
        <div className="grid min-h-[300px] grid-cols-1 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative p-lg max-lg:p-[22px] lg:p-xl">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.24),transparent_48%),radial-gradient(circle_at_16%_18%,rgba(251,191,36,0.22),transparent_22rem)]" />
            <div className="relative max-w-3xl">
              <p className="mb-sm inline-flex rounded-full bg-amber-400/15 px-md py-xs font-etiqueta text-etiqueta font-semibold text-amber-200 ring-1 ring-amber-300/30 max-lg:px-sm max-lg:text-[12px]">
                Seguridad ciudadana e iluminación pública
              </p>
              <h1 className="max-w-3xl font-titulo-principal text-[30px] leading-tight text-white max-lg:text-[28px] max-lg:leading-[1.18] sm:text-[38px]">
                Reporta, visualiza y prioriza zonas oscuras de Lima
              </h1>
              <p className="mt-sm max-w-2xl font-subtitulo text-[17px] leading-7 text-blue-100 max-lg:text-[15px] max-lg:leading-6">
                ZonaOscura conecta reportes ciudadanos con la gestión municipal para reducir rutas inseguras y planificar mantenimiento de luminarias.
              </p>
            </div>
            <div className="relative mt-lg grid grid-cols-1 gap-sm text-sm text-blue-50 max-lg:mt-md sm:grid-cols-3">
              <span className="rounded-lg border border-white/10 bg-white/10 px-md py-sm max-lg:flex max-lg:items-center max-lg:gap-sm max-lg:bg-white/[0.08] max-lg:py-[10px]">
                <span className="material-symbols-outlined hidden text-[18px] text-amber-200 max-lg:inline">map</span>
                Mapa colaborativo
              </span>
              <span className="rounded-lg border border-white/10 bg-white/10 px-md py-sm max-lg:flex max-lg:items-center max-lg:gap-sm max-lg:bg-white/[0.08] max-lg:py-[10px]">
                <span className="material-symbols-outlined hidden text-[18px] text-amber-200 max-lg:inline">photo_camera</span>
                Evidencia fotográfica
              </span>
              <span className="rounded-lg border border-white/10 bg-white/10 px-md py-sm max-lg:flex max-lg:items-center max-lg:gap-sm max-lg:bg-white/[0.08] max-lg:py-[10px]">
                <span className="material-symbols-outlined hidden text-[18px] text-amber-200 max-lg:inline">assessment</span>
                Informe municipal
              </span>
            </div>
          </div>
          <div className="relative border-t border-white/10 bg-slate-900/80 p-lg max-lg:p-[22px] lg:border-l lg:border-t-0 lg:p-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.22),transparent_18rem)]" />
            <div className="relative flex h-full min-h-[220px] flex-col justify-between max-lg:min-h-[190px]">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-md py-xs text-sm font-semibold text-blue-100 max-lg:bg-blue-100/10 max-lg:text-[13px]">Semana 08</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-amber-400 text-primary shadow-lg shadow-amber-500/25 max-lg:h-[52px] max-lg:w-[52px] max-lg:rounded-xl">
                  <span className="material-symbols-outlined fill text-[34px]">lightbulb</span>
                </div>
              </div>
              <div className="mt-xl grid grid-cols-2 gap-sm max-lg:mt-lg">
                <div className="rounded-lg border border-white/10 bg-white/10 p-md max-lg:rounded-xl max-lg:bg-white/[0.08]">
                  <p className="text-3xl font-bold text-white max-lg:text-[28px]">{metricas.pendientes}</p>
                  <p className="mt-xs text-sm text-blue-100">zonas pendientes</p>
                </div>
                <div className="rounded-lg border border-amber-300/25 bg-amber-400/15 p-md max-lg:rounded-xl">
                  <p className="text-3xl font-bold text-amber-200 max-lg:text-[28px]">{metricas.criticos}</p>
                  <p className="mt-xs text-sm text-amber-100">casos críticos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-gutter max-lg:grid-cols-2 max-lg:gap-sm md:grid-cols-2 lg:grid-cols-4">
        <StatsCard titulo="Reportes recibidos" valor={metricas.total} tono="azul" icono={<span className="material-symbols-outlined">inbox</span>} />
        <StatsCard titulo="Zonas pendientes" valor={metricas.pendientes} tono="ambar" icono={<span className="material-symbols-outlined">pending_actions</span>} />
        <StatsCard titulo="Zonas atendidas" valor={metricas.atendidos} tono="verde" icono={<span className="material-symbols-outlined">check_circle</span>} />
        <StatsCard titulo="Zonas críticas" valor={metricas.criticos} destacado icono={<span className="material-symbols-outlined">warning</span>} />
      </section>

      <div className="grid grid-cols-1 gap-gutter max-lg:gap-lg lg:grid-cols-12">
        <div className="lg:col-span-8">
          <RecentReports reportes={reportes.slice(0, 5)} />
        </div>
        <div className="lg:col-span-4">
          <QuickActions />
        </div>
      </div>

      <UserStoriesMatrix />
    </div>
  );
}
