import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "csrf_token";

export async function GET() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(COOKIE_NAME)?.value;

  if (existing) {
    return NextResponse.json({ token: existing });
  }

  const token = randomBytes(32).toString("hex");
  const response = NextResponse.json({ token });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}