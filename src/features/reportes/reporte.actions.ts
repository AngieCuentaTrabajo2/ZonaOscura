"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { reporteSchema } from "@/features/reportes/reporte.schema";
import { crearReporte, confirmarReporte } from "@/features/reportes/reporte.service";
import { authOptions } from "@/features/auth/auth.config";
import { prisma } from "@/lib/prisma";

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
  const usuarioId = await obtenerUsuarioActualId();
  await confirmarReporte(reporteId, usuarioId);
  revalidatePath(`/reportes/${reporteId}`);
  revalidatePath("/municipal/prioridades");
}
