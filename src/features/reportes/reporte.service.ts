import { EstadoReporte, NivelPrioridad, NivelRiesgo, Prisma, TipoProblema } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { FiltrosReporte } from "@/features/reportes/reporte.types";
import type { ReporteFormValues } from "@/features/reportes/reporte.schema";

function requerirDatabaseUrl() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL no está configurado.");
}

export function calcularPrioridad(nivelRiesgo: NivelRiesgo, confirmaciones = 0): NivelPrioridad {
  if (nivelRiesgo === "ALTO" || confirmaciones >= 10) return "ALTA";
  if (nivelRiesgo === "MEDIO" || (confirmaciones >= 5 && confirmaciones <= 9)) return "MEDIA";
  return "BAJA";
}

export async function generarCodigoReporte() {
  requerirDatabaseUrl();
  const anio = new Date().getFullYear();
  const total = await prisma.reporteZonaOscura.count({
    where: { codigo: { startsWith: `ZO-${anio}-` } }
  });
  return `ZO-${anio}-${String(total + 1).padStart(4, "0")}`;
}

export async function obtenerReportes(filtros: FiltrosReporte = {}) {
  requerirDatabaseUrl();
  const where: Prisma.ReporteZonaOscuraWhereInput = {
    distrito: filtros.distrito || undefined,
    estado: filtros.estado,
    tipoProblema: filtros.tipoProblema,
    prioridad: filtros.prioridad
  };

  return prisma.reporteZonaOscura.findMany({
    where,
    include: { imagenes: true, _count: { select: { confirmaciones: true } } },
    orderBy: [{ prioridad: "desc" }, { fechaCreacion: "desc" }]
  });
}

export async function obtenerReportePorId(id: string) {
  requerirDatabaseUrl();
  return prisma.reporteZonaOscura.findUnique({
    where: { id },
    include: {
      imagenes: true,
      comentarios: { include: { usuario: true }, orderBy: { fechaCreacion: "desc" } },
      confirmaciones: true,
      historialEstados: { include: { cambiadoPor: true }, orderBy: { fechaCreacion: "desc" } },
      intervenciones: true,
      ciudadano: true,
      funcionarioAsignado: true
    }
  });
}

export async function obtenerMetricasReportes() {
  requerirDatabaseUrl();
  const [total, pendientes, atendidos, criticos] = await Promise.all([
    prisma.reporteZonaOscura.count(),
    prisma.reporteZonaOscura.count({ where: { estado: EstadoReporte.PENDIENTE } }),
    prisma.reporteZonaOscura.count({ where: { estado: EstadoReporte.ATENDIDO } }),
    prisma.reporteZonaOscura.count({ where: { OR: [{ prioridad: "ALTA" }, { nivelRiesgo: "ALTO" }] } })
  ]);
  return { total, pendientes, atendidos, criticos };
}

export async function crearReporte(values: ReporteFormValues, ciudadanoId: string) {
  requerirDatabaseUrl();
  const codigo = await generarCodigoReporte();
  const prioridad = calcularPrioridad(values.nivelRiesgo, 0);

  return prisma.reporteZonaOscura.create({
    data: {
      codigo,
      direccion: values.direccion,
      referencia: values.referencia,
      distrito: values.distrito,
      latitud: values.latitud,
      longitud: values.longitud,
      tipoProblema: values.tipoProblema,
      nivelRiesgo: values.nivelRiesgo,
      descripcion: values.descripcion,
      prioridad,
      ciudadanoId,
      imagenes: values.urlImagen
        ? {
            create: {
              urlImagen: values.urlImagen,
              claveStorage: values.urlImagen,
              nombreArchivo: "evidencia.jpg"
            }
          }
        : undefined,
      historialEstados: {
        create: {
          cambiadoPorId: ciudadanoId,
          estadoAnterior: null,
          estadoNuevo: EstadoReporte.PENDIENTE,
          nota: "Reporte registrado correctamente."
        }
      }
    }
  });
}

export async function confirmarReporte(reporteId: string, usuarioId: string) {
  requerirDatabaseUrl();
  const confirmacion = await prisma.confirmacionReporte.upsert({
    where: { reporteId_usuarioId: { reporteId, usuarioId } },
    update: {},
    create: { reporteId, usuarioId }
  });

  const totalConfirmaciones = await prisma.confirmacionReporte.count({ where: { reporteId } });
  const reporte = await prisma.reporteZonaOscura.findUnique({ where: { id: reporteId }, select: { nivelRiesgo: true } });
  if (reporte) {
    await prisma.reporteZonaOscura.update({
      where: { id: reporteId },
      data: { prioridad: calcularPrioridad(reporte.nivelRiesgo, totalConfirmaciones) }
    });
  }

  return confirmacion;
}

export const tipoProblemaOptions: TipoProblema[] = [
  "LUZ_APAGADA",
  "SIN_POSTE_LUZ",
  "LUMINARIA_INTERMITENTE",
  "ZONA_COMPLETAMENTE_OSCURA"
];
