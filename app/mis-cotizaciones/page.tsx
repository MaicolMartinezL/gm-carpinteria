import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { getQuoteStatusLabel } from "@/lib/labels";

export default async function MyQuotesPage() {
  const session = await verifySession();

  if (!session || session.role !== "CLIENT") {
    redirect("/login");
  }

  const quotes = await prisma.quote.findMany({
    where: {
      customerId: session.userId,
    },
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
  });

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mis cotizaciones</h1>
            <p className="mt-2 text-gray-600">
              Aquí puedes consultar el estado de tus solicitudes.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            Ir al catálogo
          </Link>
        </div>

        {quotes.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <h2 className="text-xl font-semibold">Aún no tienes cotizaciones</h2>
            <p className="mt-3 text-gray-600">
              Explora el catálogo y solicita una cotización para verla aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {quotes.map((quote) => (
              <article key={quote.id} className="rounded-xl border p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Cotización #{quote.id}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Fecha: {new Date(quote.createdAt).toLocaleDateString("es-CO")}
                    </p>
                  </div>

                  <span className="rounded-full border px-3 py-1 text-sm font-medium">
                    {getQuoteStatusLabel(quote.status)}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">
                    Productos solicitados:
                  </p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-600">
                    {quote.items.map((item) => (
                      <li key={item.id}>
                        {item.product.name} {item.quantity > 1 ? `(x${item.quantity})` : ""}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">
                    Detalles de la solicitud:
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    {quote.needsDescription}
                  </p>
                </div>

                {quote.adminResponse && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-700">
                      Respuesta del administrador:
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      {quote.adminResponse}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}