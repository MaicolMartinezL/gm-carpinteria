import Link from "next/link"; // importa Link para navegar entre secciones del panel
import { redirect } from "next/navigation"; // permite redirigir al login si no hay sesión válida
import { prisma } from "@/lib/prisma"; // importa Prisma para consultar la base de datos
import { verifySession } from "@/lib/auth"; // importa la función que verifica la sesión del admin
import LogoutButton from "./components/LogoutButton"; // importa el botón de cerrar sesión

export default async function AdminDashboardPage() { // crea la página principal del panel admin
  const session = await verifySession(); // verifica si existe sesión válida

  if (!session || session.role !== "ADMIN") { // valida que el usuario sea admin
    redirect("/admin/login"); // redirige al login si no cumple
  }

  const totalProducts = await prisma.product.count(); // cuenta todos los productos
  const activeProducts = await prisma.product.count({ // cuenta solo productos activos
    where: {
      active: true,
    },
  });

  const totalQuotes = await prisma.quote.count(); // cuenta todas las cotizaciones
  const pendingQuotes = await prisma.quote.count({ // cuenta cotizaciones pendientes
    where: {
      status: "PENDIENTE",
    },
  });

  const inProgressQuotes = await prisma.quote.count({ // cuenta cotizaciones en proceso
    where: {
      status: "EN_PROCESO",
    },
  });

  const answeredQuotes = await prisma.quote.count({ // cuenta cotizaciones respondidas
    where: {
      status: "RESPONDIDA",
    },
  });

  const recentQuotes = await prisma.quote.findMany({ // consulta las cotizaciones más recientes
    include: {
      product: true, // incluye el producto asociado
    },
    orderBy: {
      createdAt: "desc", // ordena de más reciente a más antigua
    },
    take: 5, // trae solo las 5 más recientes
  });

  return (
    <main className="min-h-screen p-8"> {/* contenedor principal */}
      <div className="mb-8 flex items-center justify-between"> {/* encabezado principal */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard admin</h1> {/* título */}
          <p className="mt-1 text-sm text-gray-600">Resumen general del sistema.</p> {/* texto de apoyo */}
        </div>

        <LogoutButton /> {/* botón de cerrar sesión */}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> {/* grid de tarjetas de métricas */}
        <div className="rounded-xl border p-5 shadow-sm"> {/* tarjeta */}
          <p className="text-sm text-gray-500">Total productos</p> {/* etiqueta */}
          <h2 className="mt-2 text-3xl font-bold">{totalProducts}</h2> {/* valor */}
        </div>

        <div className="rounded-xl border p-5 shadow-sm"> {/* tarjeta */}
          <p className="text-sm text-gray-500">Productos activos</p> {/* etiqueta */}
          <h2 className="mt-2 text-3xl font-bold">{activeProducts}</h2> {/* valor */}
        </div>

        <div className="rounded-xl border p-5 shadow-sm"> {/* tarjeta */}
          <p className="text-sm text-gray-500">Total cotizaciones</p> {/* etiqueta */}
          <h2 className="mt-2 text-3xl font-bold">{totalQuotes}</h2> {/* valor */}
        </div>

        <div className="rounded-xl border p-5 shadow-sm"> {/* tarjeta */}
          <p className="text-sm text-gray-500">Pendientes</p> {/* etiqueta */}
          <h2 className="mt-2 text-3xl font-bold">{pendingQuotes}</h2> {/* valor */}
        </div>

        <div className="rounded-xl border p-5 shadow-sm"> {/* tarjeta */}
          <p className="text-sm text-gray-500">En proceso</p> {/* etiqueta */}
          <h2 className="mt-2 text-3xl font-bold">{inProgressQuotes}</h2> {/* valor */}
        </div>

        <div className="rounded-xl border p-5 shadow-sm"> {/* tarjeta */}
          <p className="text-sm text-gray-500">Respondidas</p> {/* etiqueta */}
          <h2 className="mt-2 text-3xl font-bold">{answeredQuotes}</h2> {/* valor */}
        </div>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2"> {/* sección inferior */}
        <section className="rounded-xl border p-5 shadow-sm"> {/* bloque de accesos rápidos */}
          <h2 className="text-xl font-bold">Accesos rápidos</h2> {/* título */}
          <div className="mt-4 flex flex-wrap gap-3"> {/* contenedor de botones */}
            <Link
              href="/admin/cotizaciones" // lleva al módulo de cotizaciones
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Ver cotizaciones
            </Link>

            <Link
              href="/admin/productos" // lleva al módulo de productos
              className="rounded-lg border px-4 py-2"
            >
              Gestionar productos
            </Link>

            <Link
              href="/admin/productos/nuevo" // lleva al formulario de nuevo producto
              className="rounded-lg border px-4 py-2"
            >
              Nuevo producto
            </Link>
          </div>
        </section>

        <section className="rounded-xl border p-5 shadow-sm"> {/* bloque de cotizaciones recientes */}
          <h2 className="text-xl font-bold">Cotizaciones recientes</h2> {/* título */}

          {recentQuotes.length === 0 ? ( // verifica si no hay cotizaciones
            <p className="mt-4 text-sm text-gray-600">No hay cotizaciones recientes.</p>
          ) : (
            <div className="mt-4 space-y-4"> {/* lista de cotizaciones */}
              {recentQuotes.map((quote) => ( // recorre cada cotización
                <div key={quote.id} className="rounded-lg border p-4"> {/* tarjeta por cotización */}
                  <p className="font-semibold">{quote.customerName}</p> {/* nombre del cliente */}
                  <p className="text-sm text-gray-500">{quote.product.name}</p> {/* producto */}
                  <p className="mt-2 text-sm">{quote.status}</p> {/* estado */}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}