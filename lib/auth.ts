import "server-only"; // asegura que este archivo solo se use en el servidor
import { SignJWT, jwtVerify } from "jose"; // importa utilidades para firmar y verificar tokens JWT
import { cookies } from "next/headers"; // importa acceso a cookies del lado del servidor

const secretKey = process.env.SESSION_SECRET; // lee la clave secreta desde variables de entorno
if (!secretKey) throw new Error("SESSION_SECRET no está definida"); // lanza error si no existe la clave

const encodedKey = new TextEncoder().encode(secretKey); // convierte la clave a formato binario para jose

type SessionPayload = { // define la forma de los datos que guardaremos en la sesión
  userId: number; // id del usuario autenticado
  email: string; // email del usuario autenticado
  role: string; // rol del usuario autenticado
};

export async function createSession(payload: SessionPayload) { // crea una sesión firmada
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // define expiración a 7 días

  const session = await new SignJWT(payload) // inicia la construcción del token con los datos del usuario
    .setProtectedHeader({ alg: "HS256" }) // define el algoritmo de firmado
    .setIssuedAt() // agrega fecha de emisión
    .setExpirationTime("7d") // define expiración lógica del token
    .sign(encodedKey); // firma el token con la clave secreta

  const cookieStore = await cookies(); // obtiene acceso al almacén de cookies

  cookieStore.set("session", session, { // guarda el token en una cookie llamada session
    httpOnly: true, // evita acceso desde JavaScript del navegador
    secure: process.env.NODE_ENV === "production", // en producción exige HTTPS
    sameSite: "lax", // reduce riesgo CSRF básico
    expires: expiresAt, // define fecha de expiración de la cookie
    path: "/", // la cookie estará disponible en todo el sitio
  });
}

export async function verifySession() { // verifica si la cookie de sesión es válida
  const cookieStore = await cookies(); // obtiene acceso a cookies
  const cookie = cookieStore.get("session")?.value; // lee el valor de la cookie session

  if (!cookie) return null; // si no hay cookie, no hay sesión

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, { // verifica firma y validez del token
      algorithms: ["HS256"], // exige el mismo algoritmo usado al firmar
    });

    return payload as SessionPayload; // devuelve los datos del usuario si todo salió bien
  } catch {
    return null; // si el token es inválido o expiró, devuelve null
  }
}

export async function deleteSession() { // elimina la sesión actual
  const cookieStore = await cookies(); // obtiene acceso a cookies

  cookieStore.set("session", "", { // sobreescribe la cookie session
    httpOnly: true, // sigue siendo inaccesible desde JS del navegador
    secure: process.env.NODE_ENV === "production", // en producción exige HTTPS
    sameSite: "lax", // mantiene la misma política
    expires: new Date(0), // la expira inmediatamente
    path: "/", // aplica a todo el sitio
  });
}