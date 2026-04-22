"use server";

import { prisma } from "@/lib/prisma";

export type ContactState = {
  error?: string;
  success?: string;
};

export async function createContactMessage(
  _prevState: ContactState | void,
  formData: FormData
): Promise<ContactState | void> {
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const phone = formData.get("phone")?.toString().trim() || "";
  const message = formData.get("message")?.toString().trim() || "";

  if (!name || !email || !message) {
    return { error: "Completa los campos obligatorios." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { error: "El correo electrónico no tiene un formato válido." };
  }

  await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone: phone || null,
      message,
      isRead: false,
    },
  });

  return { success: "Mensaje enviado correctamente." };
}