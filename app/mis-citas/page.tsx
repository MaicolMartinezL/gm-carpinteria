import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { getAppointmentStatusLabel } from "@/lib/labels";


export default async function MyAppointmentsPage() {
  const session = await verifySession();

  if (!session || session.role !== "CLIENT") {
    redirect("/login");
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      customerId: session.userId,
    },
    orderBy: {
      scheduledAt: "desc",
    },
  });

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mis citas</h1>
            <p className="mt-2 text-gray-600">
              Aquí puedes consultar el estado de tus asesorías agendadas.
            </p>
          </div>

          <Link
            href="/agenda"
            className="rounded-lg bg-black px-5 py-3 text-white"
          >
            Agendar nueva cita
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <h2 className="text-xl font-semibold">Aún no tienes citas registradas</h2>
            <p className="mt-3 text-gray-600">
              Programa una asesoría para verla aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {appointments.map((appointment) => (
              <article
                key={appointment.id}
                className="rounded-xl border p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Cita #{appointment.id}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(appointment.scheduledAt).toLocaleString("es-CO")}
                    </p>
                  </div>

                  <span className="rounded-full border px-3 py-1 text-sm font-medium">
                    {getAppointmentStatusLabel(appointment.status)}
                  </span>
                </div>

                {appointment.notes && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700">
                      Detalles de la solicitud:
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      {appointment.notes}
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