"use server";

import { AppointmentStatus } from "@prisma/client";
import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export type UpdateAppointmentState = {
  error?: string;
  success?: string;
};

export async function updateAppointment(
  _prevState: UpdateAppointmentState | void,
  formData: FormData
): Promise<UpdateAppointmentState | void> {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const appointmentIdValue = formData.get("appointmentId")?.toString() || "";
  const statusValue = formData.get("status")?.toString() || "";

  const appointmentId = Number(appointmentIdValue);

  if (Number.isNaN(appointmentId)) {
    return { error: "La cita no es válida." };
  }

  const validStatuses = Object.values(AppointmentStatus);

  if (!validStatuses.includes(statusValue as AppointmentStatus)) {
    return { error: "El estado seleccionado no es válido." };
  }

  await prisma.appointment.update({
    where: {
      id: appointmentId,
    },
    data: {
      status: statusValue as AppointmentStatus,
    },
  });

  return { success: "Cita actualizada correctamente." };
}