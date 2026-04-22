import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { verifySession } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";

export const metadata: Metadata = {
  title: "GM Carpintería",
  description: "Catálogo y cotizaciones para empresa de carpintería",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await verifySession();

  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-black">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold text-black">
              GM Carpintería
            </Link>

            <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-black">
              <Link href="/" className="transition hover:text-gray-700">
                Inicio
              </Link>

              <Link href="/catalogo" className="transition hover:text-gray-700">
                Catálogo
              </Link>

              <Link href="/portafolio" className="transition hover:text-gray-700">
                Portafolio
              </Link>

              <Link href="/contacto" className="transition hover:text-gray-700">
                Contacto
              </Link>

              <Link href="/agenda" className="transition hover:text-gray-700">
                Agenda
              </Link>

              {!session ? (
                <>
                  <Link href="/login" className="transition hover:text-gray-700">
                    Login
                  </Link>

                  <Link href="/registro" className="transition hover:text-gray-700">
                    Registro
                  </Link>
                </>
              ) : session.role === "CLIENT" ? (
                <>
                  <Link
                    href="/mis-cotizaciones"
                    className="transition hover:text-gray-700"
                  >
                    Mis cotizaciones
                  </Link>

                  <Link
                    href="/mis-citas"
                    className="transition hover:text-gray-700"
                  >
                    Mis citas
                  </Link>

                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/admin" className="transition hover:text-gray-700">
                    Admin
                  </Link>

                  <LogoutButton />
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>

        <footer className="border-t bg-gray-100">
          <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-gray-600">
            © 2026 GM Carpintería. Todos los derechos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}