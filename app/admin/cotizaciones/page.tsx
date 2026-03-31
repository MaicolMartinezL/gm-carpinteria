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

  return (
        <main className="min-h-screen p-8"> {/* contenedor principal */}
  
        <div className="mb-6 flex items-center justify-between"> {/* contenedor del encabezado */}
            <h1 className="text-3xl font-bold">Cotizaciones recibidas</h1> {/* título */}
            <LogoutButton /> {/* botón para cerrar sesión */}
        </div>

      {quotes.length === 0 ? ( // verifica si no existen cotizaciones
        <p>No hay cotizaciones aún.</p> // muestra mensaje si la tabla está vacía
      ) : (
        <div className="overflow-x-auto"> {/* permite scroll horizontal en pantallas pequeñas */}
          <table className="w-full border-collapse"> {/* tabla principal */}
            <thead> {/* encabezado de la tabla */}
              <tr className="bg-gray-100 text-left"> {/* fila del encabezado */}
                <th className="p-3">Cliente</th> {/* columna cliente */}
                <th className="p-3">Email</th> {/* columna email */}
                <th className="p-3">Teléfono</th> {/* columna teléfono */}
                <th className="p-3">Producto</th> {/* columna producto */}
                <th className="p-3">Mensaje</th> {/* columna mensaje */}
                <th className="p-3">Estado</th> {/* columna estado */}
                <th className="p-3">Fecha</th> {/* columna fecha */}
              </tr>
            </thead>

            <tbody> {/* cuerpo de la tabla */}
              {quotes.map((quote) => ( // recorre cada cotización
                <tr key={quote.id} className="border-t align-top"> {/* crea una fila por cotización */}
                  <td className="p-3">{quote.customerName}</td> {/* nombre del cliente */}
                  <td className="p-3">{quote.customerEmail}</td> {/* correo del cliente */}
                  <td className="p-3">{quote.customerPhone}</td> {/* teléfono del cliente */}
                  <td className="p-3">{quote.product.name}</td> {/* nombre del producto */}
                  <td className="p-3">{quote.message}</td> {/* mensaje de la solicitud */}
                  <td className="p-3"> {/* celda donde estará el formulario de cambio de estado */}
                    <QuoteStatusForm
                      quoteId={quote.id} // envía el id de la cotización al componente
                      currentStatus={quote.status} // envía el estado actual al componente
                      onUpdate={updateQuoteStatus} // envía la función que actualiza el estado
                    />
                  </td>
                  <td className="p-3">
                    {new Date(quote.createdAt).toLocaleDateString("es-CO")} {/* muestra la fecha formateada */}
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