import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { markMessageAsRead } from "./actions";

export default async function AdminContactPage() {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mensajes de contacto</h1>
            <p className="mt-2 text-gray-600">
              Revisa los mensajes enviados desde el formulario público.
            </p>
          </div>

          <Link href="/admin" className="rounded-lg border px-4 py-2">
            Volver al dashboard
          </Link>
        </div>

        {messages.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <h2 className="text-xl font-semibold">No hay mensajes registrados</h2>
            <p className="mt-3 text-gray-600">
              Los mensajes enviados desde la página de contacto aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((message) => (
              <article key={message.id} className="rounded-xl border p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{message.name}</h2>
                    <p className="mt-1 text-sm text-gray-500">{message.email}</p>
                    {message.phone && (
                      <p className="mt-1 text-sm text-gray-500">{message.phone}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleString("es-CO")}
                    </p>
                  </div>

                  <span className="rounded-full border px-3 py-1 text-sm font-medium">
                    {message.isRead ? "Leído" : "No leído"}
                  </span>
                </div>

                <p className="mt-4 text-sm text-gray-700">{message.message}</p>

                {!message.isRead && (
                  <form action={markMessageAsRead} className="mt-4">
                    <input type="hidden" name="messageId" value={message.id} />
                    <button
                      type="submit"
                      className="rounded-lg border px-4 py-2 text-sm"
                    >
                      Marcar como leído
                    </button>
                  </form>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}