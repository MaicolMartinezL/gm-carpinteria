"use server";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserRole, UserStatus } from "@prisma/client";

export type UserState = {
  error?: string;
  success?: string;
};

async function ensureAdmin() {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return session;
}

export async function updateUser(
  _prevState: UserState | void,
  formData: FormData
): Promise<UserState | void> {
  const session = await ensureAdmin();

  const userIdValue = formData.get("userId")?.toString() || "";
  const roleValue = formData.get("role")?.toString() || "";
  const statusValue = formData.get("status")?.toString() || "";

  const userId = Number(userIdValue);

  if (Number.isNaN(userId)) {
    return { error: "El usuario no es válido." };
  }

  const validRoles = Object.values(UserRole);
  const validStatuses = Object.values(UserStatus);

  if (!validRoles.includes(roleValue as UserRole)) {
    return { error: "El rol seleccionado no es válido." };
  }

  if (!validStatuses.includes(statusValue as UserStatus)) {
    return { error: "El estado seleccionado no es válido." };
  }

  if (session.userId === userId && statusValue === UserStatus.BLOCKED) {
    return { error: "No puedes bloquear tu propia cuenta de administrador." };
  }

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role: roleValue as UserRole,
      status: statusValue as UserStatus,
    },
  });

  return { success: "Usuario actualizado correctamente." };
}