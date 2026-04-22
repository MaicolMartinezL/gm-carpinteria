import { QuoteStatus } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import LogoutButton from "./components/LogoutButton";

export default async function AdminDashboardPage() {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const totalProducts = await prisma.product.count();
  const activeProducts = await prisma.product.count({
    where: {
      active: true,
    },
  });

  const totalQuotes = await prisma.quote.count();

  const pendingQuotes = await prisma.quote.count({
    where: {
      status: QuoteStatus.NEW,
    },
  });

  const inProgressQuotes = await prisma.quote.count({
    where: {
      status: QuoteStatus.IN_PROGRESS,
    },
  });

  const answeredQuotes = await prisma.quote.count({
    where: {
      status: QuoteStatus.RESPONDED,
    },
  });

  const recentQuotes = await prisma.quote.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <main className="min-h-screen p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard admin</h1>
          <p className="mt-1 text-sm text-gray-600">Resumen general del sistema.</p>
        </div>

        <LogoutButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total productos</p>
          <h2 className="mt-2 text-3xl font-bold">{totalProducts}</h2>
        </div>

        <div className="rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-gray-500">Productos activos</p>
          <h2 className="mt-2 text-3xl font-bold">{activeProducts}</h2>
        </div>

        <div className="rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total cotizaciones</p>
          <h2 className="mt-2 text-3xl font-bold">{totalQuotes}</h2>
        </div>

        <div className="rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-gray-500">Nuevas</p>
          <h2 className="mt-2 text-3xl font-bold">{pendingQuotes}</h2>
        </div>

        <div className="rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-gray-500">En proceso</p>
          <h2 className="mt-2 text-3xl font-bold">{inProgressQuotes}</h2>
        </div>

        <div className="rounded-xl border p-5 shadow-sm">
          <p className="text-sm text-gray-500">Respondidas</p>
          <h2 className="mt-2 text-3xl font-bold">{answeredQuotes}</h2>
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border p-5 shadow-sm">
          <h2 className="text-xl font-bold">Accesos rápidos</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/admin/cotizaciones"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Ver cotizaciones
            </Link>

            <Link
              href="/admin/productos"
              className="rounded-lg border px-4 py-2"
            >
              Gestionar productos
            </Link>

            <Link
              href="/admin/productos/nuevo"
              className="rounded-lg border px-4 py-2"
            >
              Nuevo producto
            </Link>

            <Link
              href="/admin/agenda"
              className="rounded-lg border px-4 py-2"
            >
              Gestionar agenda
            </Link>

            <Link
              href="/admin/portafolio"
              className="rounded-lg border px-4 py-2"
            >
              Gestionar portafolio
            </Link>


            <Link
              href="/admin/usuarios"
              className="rounded-lg border px-4 py-2"
            >
              Gestionar usuarios
            </Link>

            <Link
              href="/admin/contacto"
              className="rounded-lg border px-4 py-2"
            >
              Ver mensajes
            </Link>


          </div>
        </section>

        <section className="rounded-xl border p-5 shadow-sm">
          <h2 className="text-xl font-bold">Cotizaciones recientes</h2>

          {recentQuotes.length === 0 ? (
            <p className="mt-4 text-sm text-gray-600">No hay cotizaciones recientes.</p>
          ) : (
            <div className="mt-4 space-y-4">
              {recentQuotes.map((quote) => (
                <div key={quote.id} className="rounded-lg border p-4">
                  <p className="font-semibold">{quote.customerName}</p>

                  <p className="mt-1 text-sm text-gray-500">
                    {quote.items.length > 0
                      ? quote.items.map((item) => item.product.name).join(", ")
                      : "Sin productos asociados"}
                  </p>

                  <p className="mt-2 text-sm">{quote.status}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}