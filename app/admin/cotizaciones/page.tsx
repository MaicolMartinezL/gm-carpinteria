import LogoutButton from "../components/LogoutButton"; // importa el botón de cerrar sesión
import { redirect } from "next/navigation"; // importa redirect para redirigir si no hay sesión válida
import { verifySession } from "@/lib/auth"; // importa la verificación de sesión
import { revalidatePath } from "next/cache"; // importa una función para refrescar la página después de actualizar datos
import { prisma } from "@/lib/prisma"; // importa Prisma para consultar y actualizar la base de datos
import QuoteStatusForm from "./QuoteStatusForm"; // importa el componente del formulario de cambio de estado

export default async function AdminCotizacionesPage() { // crea la página del panel admin
  
    const session = await verifySession(); // verifica la sesión actual del usuario

    if (!session || session.role !== "ADMIN") { // revisa que exista sesión y que sea admin
        redirect("/admin/login"); // envía al login si no cumple
    }
  
    async function updateQuoteStatus(formData: FormData) { // define una server action para actualizar el estado
    "use server"; // indica que esta función corre en el servidor

    const session = await verifySession(); // verifica la sesión del usuario antes de actualizar

    if (!session || session.role !== "ADMIN") { // valida que exista sesión admin
        throw new Error("No autorizado"); // bloquea la acción si no es admin
    }

    const quoteIdValue = formData.get("quoteId")?.toString() || ""; // obtiene el id de la cotización desde el formulario
    const status = formData.get("status")?.toString() || ""; // obtiene el nuevo estado desde el formulario

    const quoteId = Number(quoteIdValue); // convierte el id recibido a número

    if (Number.isNaN(quoteId) || !status) { // valida que el id sea válido y que el estado exista
      throw new Error("Datos inválidos para actualizar la cotización."); // lanza error si algo está mal
    }

    await prisma.quote.update({ // actualiza la cotización en la base de datos
      where: { id: quoteId }, // busca la cotización por su id
      data: { status }, // cambia el estado
    });

    revalidatePath("/admin/cotizaciones"); // obliga a refrescar la ruta para mostrar el cambio actualizado
  }

  const quotes = await prisma.quote.findMany({ // consulta todas las cotizaciones guardadas
    include: {
      product: true, // incluye el producto relacionado
    },
    orderBy: {
      createdAt: "desc", // ordena de la más reciente a la más antigua
    },
  });


  function getStatusStyles(status: string) { // función que devuelve estilos según el estado
  switch (status) {
    case "PENDIENTE":
      return "bg-yellow-100 text-yellow-800"; // amarillo

    case "EN_PROCESO":
      return "bg-blue-100 text-blue-800"; // azul

    case "RESPONDIDA":
      return "bg-green-100 text-green-800"; // verde

    default:
      return "bg-gray-100 text-gray-800"; // fallback
  }
}


  return (
        <main className="min-h-screen p-8"> {/* contenedor principal */}
  
        <div className="mb-6 flex items-center justify-between"> {/* contenedor del encabezado */}
            <h1 className="text-3xl font-bold">Cotizaciones recibidas</h1> {/* título */}
            <LogoutButton /> {/* botón para cerrar sesión */}
        </div>

      {quotes.length === 0 ? ( // verifica si no existen cotizaciones
        <p>No hay cotizaciones aún.</p> // muestra mensaje si la tabla está vacía
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-700 bg-gray-900"> {/* permite scroll horizontal en pantallas pequeñas */}
          <table className="w-full border border-gray-700 text-sm text-white"> {/* tabla principal */}
            <thead className="bg-gray-800 text-left text-gray-200"> {/* encabezado de la tabla con fondo gris claro */}
              <tr> {/* fila de encabezados */}
                <th className="p-3">Cliente</th> {/* columna nombre del cliente */}
                <th className="p-3">Email</th> {/* columna correo */}
                <th className="p-3">Teléfono</th> {/* columna teléfono */}
                <th className="p-3">Producto</th> {/* columna producto */}
                <th className="p-3">Mensaje</th> {/* columna mensaje */}
                <th className="p-3">Estado</th> {/* columna estado */}
                <th className="p-3">Fecha</th> {/* columna fecha */}
              </tr>
            </thead>

            <tbody> {/* cuerpo de la tabla */}
              {quotes.map((quote) => ( // recorre cada cotización
                <tr key={quote.id} className="border-t border-gray-700 align-top"> {/* fila con borde oscuro suave */}
                  <td className="p-3 text-white">{quote.customerName}</td> {/* nombre visible en blanco */}
                  <td className="p-3 text-gray-200">{quote.customerEmail}</td> {/* email en gris claro */}
                  <td className="p-3 text-gray-200">{quote.customerPhone}</td> {/* teléfono en gris claro */}
                  <td className="p-3 text-white">{quote.product.name}</td> {/* producto en blanco */}
                  <td className="p-3 text-gray-200">{quote.message}</td> {/* mensaje en gris claro */}

                  <td className="p-3"> {/* celda del estado */}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(quote.status)}`}
                    >
                      {quote.status}
                    </span>
                  </td>

                  <td className="p-3 text-gray-200">
                    {new Date(quote.createdAt).toLocaleDateString("es-CO")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}