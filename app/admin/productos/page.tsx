import Link from "next/link"; // importa Link para navegar entre páginas del panel
import { redirect } from "next/navigation"; // permite redirigir si no hay sesión válida
import { revalidatePath } from "next/cache"; // importa la función para refrescar rutas después de cambiar datos
import { prisma } from "@/lib/prisma"; // importa Prisma para consultar la base de datos
import { verifySession } from "@/lib/auth"; // importa la función que verifica la sesión
import LogoutButton from "../components/LogoutButton"; // importa el botón de cerrar sesión

//--------------------------------------
async function toggleProductStatus(formData: FormData) { // función para activar/desactivar producto
  "use server";

  const session = await verifySession(); // verifica sesión

  if (!session || session.role !== "ADMIN") {
    throw new Error("No autorizado");
  }

  const idValue = formData.get("id")?.toString() || ""; // obtiene id
  const id = Number(idValue); // convierte a número

  if (Number.isNaN(id)) {
    throw new Error("ID inválido");
  }

  const product = await prisma.product.findUnique({ // busca producto
    where: { id },
  });

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  await prisma.product.update({ // cambia el estado
    where: { id },
    data: {
      active: !product.active, // invierte el estado
    },
  });

  revalidatePath("/admin/productos"); // refresca la tabla
}
//--------------------------------

export default async function AdminProductosPage() { // crea la página del panel admin para listar productos
  const session = await verifySession(); // verifica si existe una sesión válida

  if (!session || session.role !== "ADMIN") { // valida que haya sesión y que el rol sea admin
    redirect("/admin/login"); // si no cumple, redirige al login
  }

  const products = await prisma.product.findMany({ // consulta todos los productos
    include: {
      category: true, // incluye la categoría relacionada
    },
    orderBy: {
      createdAt: "desc", // ordena del más reciente al más antiguo
    },
  });

  return ( // retorna la interfaz visual
    <main className="min-h-screen p-8"> {/* contenedor principal */}
      <div className="mb-6 flex items-center justify-between"> {/* encabezado con título y acciones */}
        <div>
          <h1 className="text-3xl font-bold">Productos</h1> {/* título principal */}
          <p className="mt-1 text-sm text-gray-600">Gestiona el catálogo de productos.</p> {/* texto de apoyo */}
        </div>

        <div className="flex items-center gap-3"> {/* contenedor de botones */}
          <Link
            href="/admin/productos/nuevo" // lleva al formulario para crear producto
            className="rounded-lg bg-black px-4 py-2 text-white" // estilos del botón nuevo producto
          >
            Nuevo producto {/* texto del botón */}
          </Link>

          <LogoutButton /> {/* botón de cerrar sesión */}
        </div>
      </div>

      {products.length === 0 ? ( // verifica si no hay productos
        <p>No hay productos registrados.</p> // muestra mensaje vacío
      ) : (
        <div className="overflow-x-auto"> {/* permite scroll horizontal en pantallas pequeñas */}
          <table className="w-full border-collapse"> {/* tabla principal */}
            <thead> {/* encabezado de la tabla */}
              <tr className="bg-gray-100 text-left"> {/* fila del encabezado */}
                <th className="p-3">Nombre</th> {/* columna nombre */}
                <th className="p-3">Categoría</th> {/* columna categoría */}
                <th className="p-3">Precio</th> {/* columna precio */}
                <th className="p-3">Estado</th> {/* columna estado */}
                <th className="p-3">Acciones</th> {/* columna acciones */}
              </tr>
            </thead>

            <tbody> {/* cuerpo de la tabla */}
              {products.map((product) => ( // recorre todos los productos
                <tr key={product.id} className="border-t"> {/* fila por producto */}
                  <td className="p-3">{product.name}</td> {/* nombre del producto */}
                  <td className="p-3">{product.category.name}</td> {/* nombre de la categoría */}
                  <td className="p-3">${product.price.toLocaleString("es-CO")}</td> {/* precio formateado */}
                  <td className="p-3">{product.active ? "Activo" : "Inactivo"}</td> {/* estado del producto */}
                  <td className="p-3 flex gap-3"> {/* celda con acciones */}

                    <Link
                        href={`/admin/productos/${product.id}/editar`} // enlace para editar
                        className="text-sm underline"
                    >
                        Editar
                    </Link>

                    <form action={toggleProductStatus}> {/* formulario para activar/desactivar */}
                        <input type="hidden" name="id" value={product.id} /> {/* envía el id del producto */}

                        <button
                        className="text-sm text-red-600 underline"
                        >
                        {product.active ? "Desactivar" : "Activar"} {/* cambia texto según estado */}
                        </button>
                    </form>

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