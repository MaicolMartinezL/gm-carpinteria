import { verifySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppointmentForm from "./ui/AppointmentForm";

export default async function AgendaPage() {
  const session = await verifySession();

  const user =
    session?.role === "CLIENT"
      ? await prisma.user.findUnique({
          where: { id: session.userId },
          select: {
            name: true,
            email: true,
            phone: true,
          },
        })
      : null;

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr]">
        <section>
          <h1 className="text-3xl font-bold">Agendar asesoría</h1>
          <p className="mt-3 text-gray-600">
            Programa una asesoría para revisar tus necesidades y ayudarte con una
            solución personalizada.
          </p>

          <div className="mt-8 rounded-xl border p-6">
            <h2 className="text-xl font-semibold">Información importante</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-600">
              <li>Selecciona una fecha y hora disponibles.</li>
              <li>No se permiten reservas duplicadas en el mismo horario.</li>
              <li>Un administrador confirmará o cancelará la solicitud.</li>
              <li>Si estás logueado como cliente, tu cita quedará asociada a tu cuenta.</li>
            </ul>
          </div>
        </section>

        <section>
          <AppointmentForm user={user} />
        </section>
      </div>
    </main>
  );
}