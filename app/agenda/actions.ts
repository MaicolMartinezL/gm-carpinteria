"use server";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { AppointmentStatus } from "@prisma/client";

export type AppointmentState = {
  error?: string;
  success?: string;
};

export async function createAppointment(
  _prevState: AppointmentState | void,
  formData: FormData
): Promise<AppointmentState | void> {
  const session = await verifySession();

  const customerName = formData.get("customerName")?.toString().trim() || "";
  const customerEmail = formData.get("customerEmail")?.toString().trim() || "";
  const customerPhone = formData.get("customerPhone")?.toString().trim() || "";
  const notes = formData.get("notes")?.toString().trim() || "";
  const date = formData.get("date")?.toString() || "";
  const time = formData.get("time")?.toString() || "";

  if (!customerName || !customerEmail || !date || !time) {
    return { error: "Completa los campos obligatorios." };
  }

  const scheduledAt = new Date(`${date}T${time}:00`);

  if (Number.isNaN(scheduledAt.getTime())) {
    return { error: "La fecha u hora seleccionada no es válida." };
  }

  const existingAppointment = await prisma.appointment.findUnique({
    where: {
      scheduledAt,
    },
  });

  if (existingAppointment) {
    return { error: "Ese horario ya está ocupado. Elige otro." };
  }

  await prisma.appointment.create({
    data: {
      customerName,
      customerEmail,
      customerPhone: customerPhone || null,
      notes: notes || null,
      scheduledAt,
      status: AppointmentStatus.PENDING,
      customerId: session?.role === "CLIENT" ? session.userId : null,
    },
  });

  return { success: "Asesoría agendada correctamente." };
}