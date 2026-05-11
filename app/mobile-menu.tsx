"use client";

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/logout-button";

interface MobileMenuProps {
  session: { role: string } | null;
}

export default function MobileMenu({ session }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className="md:hidden p-2 rounded-md text-black hover:bg-gray-100 transition"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Menú desplegable mobile */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-md z-50 md:hidden">
          <div className="flex flex-col px-6 py-4 gap-4 text-sm font-medium text-black">
            <Link href="/" onClick={() => setOpen(false)} className="transition hover:text-gray-700">Inicio</Link>
            <Link href="/catalogo" onClick={() => setOpen(false)} className="transition hover:text-gray-700">Catálogo</Link>
            <Link href="/portafolio" onClick={() => setOpen(false)} className="transition hover:text-gray-700">Portafolio</Link>
            <Link href="/contacto" onClick={() => setOpen(false)} className="transition hover:text-gray-700">Contacto</Link>
            <Link href="/agenda" onClick={() => setOpen(false)} className="transition hover:text-gray-700">Agenda</Link>

            {!session ? (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="transition hover:text-gray-700">Login</Link>
                <Link href="/registro" onClick={() => setOpen(false)} className="transition hover:text-gray-700">Registro</Link>
              </>
            ) : session.role === "CLIENT" ? (
              <>
                <Link href="/mis-cotizaciones" onClick={() => setOpen(false)} className="transition hover:text-gray-700">Mis cotizaciones</Link>
                <Link href="/mis-citas" onClick={() => setOpen(false)} className="transition hover:text-gray-700">Mis citas</Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/admin" onClick={() => setOpen(false)} className="transition hover:text-gray-700">Admin</Link>
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}