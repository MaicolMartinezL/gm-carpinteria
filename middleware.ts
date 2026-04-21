import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.SESSION_SECRET;

if (!secretKey) {
  throw new Error("SESSION_SECRET no está definida");
}

const encodedKey = new TextEncoder().encode(secretKey);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("session")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, encodedKey, {
      algorithms: ["HS256"],
    });

    if (payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete("session");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};