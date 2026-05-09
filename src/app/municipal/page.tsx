import Link from "next/link";
import { MunicipalStatsCards } from "@/components/municipal/MunicipalStatsCards";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { Card } from "@/components/ui/Card";
import { obtenerDashboardMunicipal } from "@/features/municipal/municipal.service";
import { obtenerMetricasReportes } from "@/features/reportes/reporte.service";
import { reportesDemo } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function MunicipalPage() {
  let data: any = { total: 128, pendientes: 46, evaluacion: 22, atendidos: 72, porDistrito: [], ultimos: reportesDemo };
  try {
    data = await obtenerDashboardMunicipal();
  } catch {}
  const criticos = await obtenerMetricasSeguras();

  return (
    <div className="flex flex-col gap-xl">
      <section className="rounded-lg border border-slate-200 bg-slate-950 p-lg text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)]">
        <p className="font-etiqueta text-etiqueta font-semibold uppercase text-amber-200">Gestión municipal</p>
        <h1 className="mt-xs font-titulo-principal text-titulo-principal text-white">Panel municipal</h1>
        <p className="mt-xs max-w-3xl text-blue-100">Indicadores para revisar reportes, evitar duplicidad de intervención y priorizar mantenimiento de alumbrado público.</p>
      </section>
      <MunicipalStatsCards data={{ ...data, criticos }} />
      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <Card className="p-lg lg:col-span-5">
          <h2 className="font-subtitulo text-subtitulo text-primary">Resumen por distrito</h2>
          <div className="mt-md space-y-md">
            {(data.porDistrito.length ? data.porDistrito : [
              { distrito: "Pachacámac", _count: 64 },
              { distrito: "Manchay", _count: 42 },
              { distrito: "José Gálvez", _count: 22 }
            ]).map((item: any) => (
              <div key={item.distrito}>
                <div className="flex justify-between gap-md text-sm"><span>{item.distrito}</span><strong>{item._count} reportes</strong></div>
                <div className="mt-xs h-2 overflow-hidden rounded-full bg-surface-container"><div className="h-full bg-safety-blue" style={{ width: `${Math.min(100, item._count)}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-lg lg:col-span-3">
          <h2 className="font-subtitulo text-subtitulo text-primary">Acciones rápidas</h2>
          <div className="mt-md flex flex-col gap-md">
            <Link className="rounded-lg bg-primary px-md py-sm text-center font-semibold text-on-primary" href="/municipal/prioridades">Ver prioridades</Link>
            <Link className="rounded-lg border border-outline-variant bg-white px-md py-sm text-center font-semibold text-primary hover:bg-surface-container-low" href="/municipal/informes">Generar informe</Link>
          </div>
        </Card>
        <div className="lg:col-span-4">
          <RecentReports reportes={data.ultimos.slice(0, 3)} />
        </div>
      </div>
    </div>
  );
}

async function obtenerMetricasSeguras() {
  try {
    const metricas = await obtenerMetricasReportes();
    return metricas.criticos;
  } catch {
    return 10;
  }
}
