import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;

if (!secretKey) {
  throw new Error("SESSION_SECRET no está definida");
}

const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  userId: number;
  email: string;
  role: "ADMIN" | "CLIENT";
  iat?: number;
  exp?: number;
};

export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return {
      userId: Number(payload.userId),
      email: String(payload.email),
      role: payload.role as "ADMIN" | "CLIENT",
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}