import { PrismaClient, EstadoReporte, NivelPrioridad, NivelRiesgo, RolUsuario, TipoProblema } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const reportes = [
  ["ZO-2026-0001", "Av. Los Álamos cuadra 5", "Pachacámac", TipoProblema.LUZ_APAGADA, NivelRiesgo.MEDIO, EstadoReporte.PENDIENTE, NivelPrioridad.MEDIA, -12.2296, -76.8614, 4],
  ["ZO-2026-0002", "Jr. Las Palmeras cuadra 4", "Manchay", TipoProblema.SIN_POSTE_LUZ, NivelRiesgo.ALTO, EstadoReporte.EN_EVALUACION, NivelPrioridad.ALTA, -12.1129, -76.8832, 12],
  ["ZO-2026-0003", "Av. Principal con Calle 8", "José Gálvez", TipoProblema.ZONA_COMPLETAMENTE_OSCURA, NivelRiesgo.ALTO, EstadoReporte.EN_PROCESO, NivelPrioridad.ALTA, -12.2015, -76.9348, 9],
  ["ZO-2026-0004", "Calle Los Pinos", "Pachacámac", TipoProblema.LUMINARIA_INTERMITENTE, NivelRiesgo.BAJO, EstadoReporte.ATENDIDO, NivelPrioridad.BAJA, -12.2255, -76.8661, 2],
  ["ZO-2026-0005", "Jr. Los Cedros cuadra 2", "Manchay", TipoProblema.LUZ_APAGADA, NivelRiesgo.MEDIO, EstadoReporte.PENDIENTE, NivelPrioridad.MEDIA, -12.1193, -76.878, 6],
  ["ZO-2026-0006", "Av. Central cuadra 5", "José Gálvez", TipoProblema.SIN_POSTE_LUZ, NivelRiesgo.ALTO, EstadoReporte.RECHAZADO, NivelPrioridad.ALTA, -12.2058, -76.9383, 1],
  ["ZO-2026-0007", "Calle Santa Rosa", "Pachacámac", TipoProblema.ZONA_COMPLETAMENTE_OSCURA, NivelRiesgo.ALTO, EstadoReporte.PENDIENTE, NivelPrioridad.ALTA, -12.2311, -76.8578, 14]
] as const;

async function main() {
  const claveHash = await bcrypt.hash("ZonaOscura2026", 10);

  const ciudadano = await prisma.usuario.upsert({
    where: { correo: "ciudadano@zonaoscura.pe" },
    update: {},
    create: { nombres: "María", apellidos: "Quispe", correo: "ciudadano@zonaoscura.pe", claveHash, rol: RolUsuario.CIUDADANO, distrito: "Pachacámac" }
  });

  const vecinos = await Promise.all(
    ["vecino1@zonaoscura.pe", "vecino2@zonaoscura.pe", "vecino3@zonaoscura.pe", "vecino4@zonaoscura.pe"].map((correo, index) =>
      prisma.usuario.upsert({
        where: { correo },
        update: {},
        create: {
          nombres: ["Luis", "Rosa", "Carmen", "Diego"][index],
          apellidos: "Vecinal",
          correo,
          claveHash,
          rol: RolUsuario.CIUDADANO,
          distrito: ["Pachacámac", "Manchay", "José Gálvez", "Pachacámac"][index]
        }
      })
    )
  );

  const municipal = await prisma.usuario.upsert({
    where: { correo: "municipal@zonaoscura.pe" },
    update: {},
    create: { nombres: "Jhan", apellidos: "Pérez", correo: "municipal@zonaoscura.pe", claveHash, rol: RolUsuario.MUNICIPAL, distrito: "Pachacámac" }
  });

  await prisma.usuario.upsert({
    where: { correo: "admin@zonaoscura.pe" },
    update: {},
    create: { nombres: "Admin", apellidos: "ZonaOscura", correo: "admin@zonaoscura.pe", claveHash, rol: RolUsuario.ADMIN }
  });

  for (const [codigo, direccion, distrito, tipoProblema, nivelRiesgo, estado, prioridad, latitud, longitud, confirmaciones] of reportes) {
    const reporte = await prisma.reporteZonaOscura.upsert({
      where: { codigo },
      update: {},
      create: {
        codigo,
        direccion,
        distrito,
        latitud,
        longitud,
        tipoProblema,
        nivelRiesgo,
        estado,
        prioridad,
        ciudadanoId: ciudadano.id,
        funcionarioAsignadoId: estado === EstadoReporte.PENDIENTE ? null : municipal.id,
        fechaSolucion: estado === EstadoReporte.ATENDIDO ? new Date("2026-05-05T10:00:00-05:00") : null,
        descripcion: `Reporte ciudadano en ${direccion}. La zona presenta iluminación pública deficiente y genera riesgo para vecinos y transeúntes.`,
        imagenes: {
          create: {
            urlImagen: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=1200&auto=format&fit=crop",
            claveStorage: `seed/${codigo}`,
            nombreArchivo: `${codigo}.jpg`,
            tipoArchivo: "image/jpeg",
            tamanioBytes: 240000
          }
        },
        historialEstados: {
          create: {
            cambiadoPorId: municipal.id,
            estadoAnterior: null,
            estadoNuevo: estado,
            nota: "Registro inicial de prueba para demo municipal."
          }
        }
      }
    });

    const usuariosConfirmacion = [ciudadano, ...vecinos].slice(0, Math.min(confirmaciones, vecinos.length + 1));
    for (const usuario of usuariosConfirmacion) {
      await prisma.confirmacionReporte.upsert({
        where: { reporteId_usuarioId: { reporteId: reporte.id, usuarioId: usuario.id } },
        update: {},
        create: { reporteId: reporte.id, usuarioId: usuario.id }
      });
    }
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
