"use server";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

async function ensureAdmin() {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }
}

export async function markMessageAsRead(formData: FormData) {
  await ensureAdmin();

  const messageIdValue = formData.get("messageId")?.toString() || "";
  const messageId = Number(messageIdValue);

  if (Number.isNaN(messageId)) {
    throw new Error("Mensaje inválido.");
  }

  await prisma.contactMessage.updateMany({
    where: { id: messageId },
    data: { isRead: true },
  });
}