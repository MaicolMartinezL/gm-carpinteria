import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import UserUpdateForm from "./components/UserUpdateForm";

export default async function AdminUsersPage() {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de usuarios</h1>
            <p className="mt-2 text-gray-600">
              Administra roles y estados de las cuentas registradas.
            </p>
          </div>

          <Link href="/admin" className="rounded-lg border px-4 py-2">
            Volver al dashboard
          </Link>
        </div>

        {users.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <h2 className="text-xl font-semibold">No hay usuarios registrados</h2>
            <p className="mt-3 text-gray-600">
              Las cuentas creadas en el sistema aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {users.map((user) => (
              <article key={user.id} className="rounded-xl border p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="mt-1 text-sm text-gray-500">{user.email}</p>
                    {user.phone && (
                      <p className="mt-1 text-sm text-gray-500">{user.phone}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Creado: {new Date(user.createdAt).toLocaleDateString("es-CO")}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <span className="rounded-full border px-3 py-1 text-sm font-medium">
                      {user.role}
                    </span>
                    <span className="rounded-full border px-3 py-1 text-sm font-medium">
                      {user.status}
                    </span>
                  </div>
                </div>

                <UserUpdateForm
                  userId={user.id}
                  currentRole={user.role}
                  currentStatus={user.status}
                  isCurrentAdmin={session.userId === user.id}
                />
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}