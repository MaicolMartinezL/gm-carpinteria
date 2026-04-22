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

  redirect("/mis-cotizaciones");
}

export async function register(
  _prevState: AuthState | void,
  formData: FormData
): Promise<AuthState | void> {
  const name = formData.get("name")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim().toLowerCase() || "";
  const phone = formData.get("phone")?.toString().trim() || "";
  const password = formData.get("password")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  if (!name || !email || !password || !confirmPassword) {
    return { error: "Completa todos los campos obligatorios." };
  }

  if (password !== confirmPassword) {
    return { error: "Las contraseñas no coinciden." };
  }

  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Ya existe un usuario registrado con ese correo." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash,
      role: "CLIENT",
      status: "ACTIVE",
    },
  });

  await createSession({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  redirect("/mis-cotizaciones");
}

export async function logout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/");
}