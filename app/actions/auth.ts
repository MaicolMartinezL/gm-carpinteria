"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AuthState = {
  error?: string;
};

const secretKey = process.env.SESSION_SECRET;

if (!secretKey) {
  throw new Error("SESSION_SECRET no está definida");
}

const encodedKey = new TextEncoder().encode(secretKey);

async function createSession(payload: {
  userId: number;
  email: string;
  role: "ADMIN" | "CLIENT";
}) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function login(
  _prevState: AuthState | void,
  formData: FormData
): Promise<AuthState | void> {
  const email = formData.get("email")?.toString().trim().toLowerCase() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return { error: "Correo y contraseña son obligatorios." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: "Credenciales incorrectas." };
  }

  if (user.status !== "ACTIVE") {
    return { error: "Tu cuenta está bloqueada o inactiva." };
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return { error: "Credenciales incorrectas." };
  }

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  redirect("/");
}

export async function logout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/admin/login");
}