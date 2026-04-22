import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import QuoteUpdateForm from "./components/QuoteUpdateForm";
import { getQuoteStatusLabel } from "@/lib/labels";

export default async function AdminQuotesPage() {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const quotes = await prisma.quote.findMany({
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de cotizaciones</h1>
            <p className="mt-2 text-gray-600">
              Revisa, actualiza y responde las solicitudes de los clientes.
            </p>
          </div>

          <Link href="/admin" className="rounded-lg border px-4 py-2">
            Volver al dashboard
          </Link>
        </div>

        {quotes.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <h2 className="text-xl font-semibold">No hay cotizaciones registradas</h2>
            <p className="mt-3 text-gray-600">
              Cuando los usuarios envíen solicitudes, aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {quotes.map((quote) => (
              <article key={quote.id} className="rounded-xl border p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Cotización #{quote.id}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Fecha: {new Date(quote.createdAt).toLocaleDateString("es-CO")}
                    </p>
                  </div>

                  <span className="rounded-full border px-3 py-1 text-sm font-medium">
                    {getQuoteStatusLabel(quote.status)}
                  </span>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Cliente
                    </h3>
                    <div className="mt-3 space-y-1 text-sm text-gray-700">
                      <p>
                        <span className="font-medium">Nombre:</span> {quote.customerName}
                      </p>
                      <p>
                        <span className="font-medium">Correo:</span> {quote.customerEmail}
                      </p>
                      {quote.customerPhone && (
                        <p>
                          <span className="font-medium">Teléfono:</span> {quote.customerPhone}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Usuario registrado:</span>{" "}
                        {quote.customer ? quote.customer.email : "No"}
                      </p>
                    </div>

                    <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Productos solicitados
                    </h3>
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
                      {quote.items.map((item) => (
                        <li key={item.id}>
                          {item.product.name}
                          {item.quantity > 1 ? ` (x${item.quantity})` : ""}
                        </li>
                      ))}
                    </ul>

                    <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Descripción de la necesidad
                    </h3>
                    <p className="mt-3 text-sm text-gray-700">
                      {quote.needsDescription}
                    </p>
                  </div>

                  <div>
                    <QuoteUpdateForm
                      quoteId={quote.id}
                      currentStatus={quote.status}
                      currentResponse={quote.adminResponse}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}