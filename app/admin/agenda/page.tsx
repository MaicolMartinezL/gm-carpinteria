import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import AppointmentUpdateForm from "./components/AppointmentUpdateForm";
import { getAppointmentStatusLabel } from "@/lib/labels";

export default async function AdminAgendaPage() {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const appointments = await prisma.appointment.findMany({
    include: {
      customer: true,
    },
    orderBy: {
      scheduledAt: "asc",
    },
  });

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de agenda</h1>
            <p className="mt-2 text-gray-600">
              Administra las solicitudes de asesoría registradas en el sistema.
            </p>
          </div>

          <Link href="/admin" className="rounded-lg border px-4 py-2">
            Volver al dashboard
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <h2 className="text-xl font-semibold">No hay citas registradas</h2>
            <p className="mt-3 text-gray-600">
              Las nuevas solicitudes de asesoría aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <article key={appointment.id} className="rounded-xl border p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Cita #{appointment.id}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(appointment.scheduledAt).toLocaleString("es-CO")}
                    </p>
                  </div>

                  <span className="rounded-full border px-3 py-1 text-sm font-medium">
                    {getAppointmentStatusLabel(appointment.status)}
                    </span>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Cliente
                    </h3>
                    <div className="mt-3 space-y-1 text-sm text-gray-700">
                      <p>
                        <span className="font-medium">Nombre:</span> {appointment.customerName}
                      </p>
                      <p>
                        <span className="font-medium">Correo:</span> {appointment.customerEmail}
                      </p>
                      {appointment.customerPhone && (
                        <p>
                          <span className="font-medium">Teléfono:</span> {appointment.customerPhone}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Usuario registrado:</span>{" "}
                        {appointment.customer ? appointment.customer.email : "No"}
                      </p>
                    </div>

                    {appointment.notes && (
                      <>
                        <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
                          Detalles
                        </h3>
                        <p className="mt-3 text-sm text-gray-700">{appointment.notes}</p>
                      </>
                    )}
                  </div>

                  <div>
                    <AppointmentUpdateForm
                      appointmentId={appointment.id}
                      currentStatus={appointment.status}
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