"use server";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { QuoteStatus } from "@prisma/client";

export type UpdateQuoteState = {
  error?: string;
  success?: string;
};

export async function updateQuote(
  _prevState: UpdateQuoteState | void,
  formData: FormData
): Promise<UpdateQuoteState | void> {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const quoteIdValue = formData.get("quoteId")?.toString() || "";
  const statusValue = formData.get("status")?.toString() || "";
  const adminResponse = formData.get("adminResponse")?.toString().trim() || "";

  const quoteId = Number(quoteIdValue);

  if (Number.isNaN(quoteId)) {
    return { error: "La cotización no es válida." };
  }

  const validStatuses = Object.values(QuoteStatus);

  if (!validStatuses.includes(statusValue as QuoteStatus)) {
    return { error: "El estado seleccionado no es válido." };
  }

  await prisma.quote.update({
    where: {
      id: quoteId,
    },
    data: {
      status: statusValue as QuoteStatus,
      adminResponse: adminResponse || null,
    },
  });

  return { success: "Cotización actualizada correctamente." };
}