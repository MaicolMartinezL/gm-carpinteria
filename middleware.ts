import { NextResponse } from "next/server"; // importa la respuesta de Next para continuar o redirigir
import type { NextRequest } from "next/server"; // importa el tipo de request que usa el middleware
import { jwtVerify } from "jose"; // importa la función para verificar el token de sesión

const secretKey = process.env.SESSION_SECRET; // obtiene la clave secreta desde variables de entorno

if (!secretKey) { // valida que la variable exista
  throw new Error("SESSION_SECRET no está definida"); // lanza error si falta
}

const encodedKey = new TextEncoder().encode(secretKey); // convierte la clave a formato binario para jose

export async function middleware(request: NextRequest) { // crea el middleware que se ejecuta en cada request protegida
  const { pathname } = request.nextUrl; // obtiene la ruta actual que el usuario quiere visitar

  if (pathname === "/admin/login") { // permite el acceso libre al login admin
    return NextResponse.next(); // deja pasar al login sin validar sesión
  }

  const sessionCookie = request.cookies.get("session")?.value; // intenta leer la cookie de sesión

  if (!sessionCookie) { // si no existe sesión
    return NextResponse.redirect(new URL("/admin/login", request.url)); // redirige al login
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, encodedKey, { // verifica que el token sea válido y esté firmado correctamente
      algorithms: ["HS256"], // exige el algoritmo correcto
    });

    if (payload.role !== "ADMIN") { // verifica que el rol del usuario sea ADMIN
      return NextResponse.redirect(new URL("/admin/login", request.url)); // si no es admin, redirige al login
    }

    return NextResponse.next(); // si la sesión es válida y es admin, deja pasar
  } catch {
    return NextResponse.redirect(new URL("/admin/login", request.url)); // si el token es inválido o expiró, redirige al login
  }
}

export const config = { // define en qué rutas se aplica el middleware
  matcher: ["/admin/:path*"], // protege todas las rutas que empiecen por /admin
};