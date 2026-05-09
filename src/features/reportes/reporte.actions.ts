"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { reporteSchema } from "@/features/reportes/reporte.schema";
import { crearReporte, confirmarReporte } from "@/features/reportes/reporte.service";
import { authOptions } from "@/features/auth/auth.config";
import { prisma } from "@/lib/prisma";
import { actualizarEstadoReporte } from "@/features/municipal/municipal.service";

async function obtenerUsuarioActualId() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;
  const usuario = await prisma.usuario.findFirst({ where: { rol: "CIUDADANO" } });
  if (!usuario) throw new Error("No hay usuario ciudadano para asociar el reporte. Ejecuta pnpm prisma db seed.");
  return usuario.id;
}

export async function crearReporteAction(_: unknown, formData: FormData) {
  const parsed = reporteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, mensaje: parsed.error.errors[0]?.message ?? "Datos inválidos." };
  }

  const ciudadanoId = await obtenerUsuarioActualId();
  try {
    const reporte = await crearReporte(parsed.data, ciudadanoId);
    revalidatePath("/");
    revalidatePath("/mapa");
    revalidatePath("/reportes");
    redirect(`/reportes/${reporte.id}`);
  } catch {
    return { ok: false, mensaje: "No se pudo registrar el reporte. Revisa la conexión a la base de datos." };
  }
}

export async function confirmarReporteAction(reporteId: string) {
  try {
    const usuarioId = await obtenerUsuarioActualId();
    await confirmarReporte(reporteId, usuarioId);
    revalidatePath(`/reportes/${reporteId}`);
    revalidatePath("/municipal/prioridades");
    revalidatePath("/");
  } catch {
    return;
  }
}

export async function actualizarEstadoReporteAction(reporteId: string, formData: FormData) {
  const estadoNuevo = String(formData.get("estadoNuevo"));
  const nota = String(formData.get("nota") ?? "");
  if (!["PENDIENTE", "EN_EVALUACION", "EN_PROCESO", "ATENDIDO", "RECHAZADO"].includes(estadoNuevo)) return;

  try {
    const session = await getServerSession(authOptions);
    const municipal = session?.user?.id
      ? { id: session.user.id }
      : await prisma.usuario.findFirst({ where: { rol: { in: ["MUNICIPAL", "ADMIN"] } }, select: { id: true } });
    if (!municipal?.id) return;

    await actualizarEstadoReporte({
      reporteId,
      cambiadoPorId: municipal.id,
      funcionarioAsignadoId: municipal.id,
      estadoNuevo: estadoNuevo as any,
      nota: nota || "Estado actualizado desde el panel municipal."
    });
    revalidatePath(`/reportes/${reporteId}`);
    revalidatePath("/municipal");
    revalidatePath("/municipal/historial");
    revalidatePath("/municipal/prioridades");
    revalidatePath("/reportes");
  } catch {
    return;
  }
}
