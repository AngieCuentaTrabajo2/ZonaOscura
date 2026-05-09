import { EstadoReporte } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function requerirDatabaseUrl() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL no está configurado.");
}

export async function obtenerDashboardMunicipal() {
  requerirDatabaseUrl();
  const [total, pendientes, evaluacion, atendidos, porDistrito, ultimos, criticos] = await Promise.all([
    prisma.reporteZonaOscura.count(),
    prisma.reporteZonaOscura.count({ where: { estado: EstadoReporte.PENDIENTE } }),
    prisma.reporteZonaOscura.count({ where: { estado: EstadoReporte.EN_EVALUACION } }),
    prisma.reporteZonaOscura.count({ where: { estado: EstadoReporte.ATENDIDO } }),
    prisma.reporteZonaOscura.groupBy({ by: ["distrito"], _count: true, orderBy: { _count: { distrito: "desc" } } }),
    prisma.reporteZonaOscura.findMany({
      take: 5,
      orderBy: { fechaCreacion: "desc" },
      include: { _count: { select: { confirmaciones: true } } }
    }),
    prisma.reporteZonaOscura.count({ where: { OR: [{ prioridad: "ALTA" }, { nivelRiesgo: "ALTO" }] } })
  ]);

  return { total, pendientes, evaluacion, atendidos, porDistrito, ultimos, criticos };
}

export async function actualizarEstadoReporte(data: {
  reporteId: string;
  cambiadoPorId: string;
  estadoNuevo: EstadoReporte;
  nota?: string;
  funcionarioAsignadoId?: string;
}) {
  requerirDatabaseUrl();
  const actual = await prisma.reporteZonaOscura.findUniqueOrThrow({ where: { id: data.reporteId } });
  return prisma.$transaction([
    prisma.reporteZonaOscura.update({
      where: { id: data.reporteId },
      data: {
        estado: data.estadoNuevo,
        funcionarioAsignadoId: data.funcionarioAsignadoId,
        fechaSolucion: data.estadoNuevo === EstadoReporte.ATENDIDO ? new Date() : actual.fechaSolucion
      }
    }),
    prisma.historialEstadoReporte.create({
      data: {
        reporteId: data.reporteId,
        cambiadoPorId: data.cambiadoPorId,
        estadoAnterior: actual.estado,
        estadoNuevo: data.estadoNuevo,
        nota: data.nota
      }
    })
  ]);
}
