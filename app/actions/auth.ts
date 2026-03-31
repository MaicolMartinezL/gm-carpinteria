"use server"; // indica que este archivo contiene funciones que corren en el servidor

import { z } from "zod"; // importa Zod para validar datos del formulario
import bcrypt from "bcryptjs"; // importa bcrypt para comparar contraseñas
import { redirect } from "next/navigation"; // importa redirect para navegar después del login
import { prisma } from "@/lib/prisma"; // importa Prisma para consultar usuarios
import { createSession, deleteSession } from "@/lib/auth"; // importa utilidades de sesión

const LoginSchema = z.object({ // define el esquema de validación del formulario
  email: z.email("Ingresa un correo válido").trim(), // valida que el email sea correcto
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"), // valida longitud mínima
});

export type LoginState = { // define el estado que devolverá la acción al formulario
  error?: string; // mensaje de error general
} | undefined;

export async function login(state: LoginState, formData: FormData) { // define la acción de login
  const validatedFields = LoginSchema.safeParse({ // valida los datos que llegan del formulario
    email: formData.get("email"), // toma el email del formulario
    password: formData.get("password"), // toma la contraseña del formulario
  });

  if (!validatedFields.success) { // verifica si la validación falló
    return { error: "Credenciales inválidas." }; // devuelve error simple al usuario
  }

  const { email, password } = validatedFields.data; // extrae email y contraseña validados

  const user = await prisma.user.findUnique({ // busca un usuario por email
    where: { email }, // filtra por el email ingresado
  });

  if (!user) { // verifica si no existe el usuario
    return { error: "Usuario o contraseña incorrectos." }; // devuelve error genérico
  }

  const passwordMatch = await bcrypt.compare(password, user.password); // compara la contraseña ingresada con la hasheada

  if (!passwordMatch) { // verifica si la contraseña no coincide
    return { error: "Usuario o contraseña incorrectos." }; // devuelve error genérico
  }

  if (user.role !== "ADMIN") { // verifica que el usuario tenga rol admin
    return { error: "No tienes permisos de administrador." }; // bloquea acceso si no es admin
  }

  await createSession({ // crea la sesión del usuario autenticado
    userId: user.id, // guarda el id del usuario
    email: user.email, // guarda el email del usuario
    role: user.role, // guarda el rol del usuario
  });

  redirect("/admin/cotizaciones"); // redirige al panel admin después de iniciar sesión
}

export async function logout() { // define la acción para cerrar sesión
  await deleteSession(); // elimina la cookie de sesión
  redirect("/admin/login"); // redirige al login
}