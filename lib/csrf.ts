import { cookies } from "next/headers";
import { randomBytes } from "crypto";

const COOKIE_NAME = "csrf_token";

export async function getCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;
  if (existing) return existing;
  return randomBytes(32).toString("hex");
}

export async function validateCsrfToken(headerToken: string): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(COOKIE_NAME)?.value;
  if (!cookieToken || !headerToken) return false;
  return cookieToken === headerToken;
}