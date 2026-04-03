import { redirect } from "next/navigation"; // permite redirigir al login o a la lista de productos
import { revalidatePath } from "next/cache"; // permite refrescar la lista de productos después de crear uno
import { prisma } from "@/lib/prisma"; // importa Prisma para consultar y guardar datos
import ProductCreateForm from "./ProductCreateForm"; // importa el formulario cliente para crear productos
import { verifySession } from "@/lib/auth"; // importa la verificación de sesión

export default async function NuevoProductoPage() { // crea la página para crear un producto nuevo
  const session = await verifySession(); // verifica la sesión actual

  if (!session || session.role !== "ADMIN") { // valida que el usuario sea admin
    redirect("/admin/login"); // redirige al login si no cumple
  }

  const categories = await prisma.category.findMany({ // consulta todas las categorías
    orderBy: {
      name: "asc", // ordena alfabéticamente por nombre
    },
  });

  async function createProduct(formData: FormData) { // server action para crear un producto
    "use server"; // indica que esta función corre en el servidor

    const session = await verifySession(); // vuelve a verificar sesión antes de guardar

    if (!session || session.role !== "ADMIN") { // valida permisos
      throw new Error("No autorizado"); // bloquea si no es admin
    }

    const name = formData.get("name")?.toString().trim() || ""; // obtiene el nombre del producto
    const slug = formData.get("slug")?.toString().trim() || ""; // obtiene el slug del producto
    const description = formData.get("description")?.toString().trim() || ""; // obtiene la descripción
    const priceValue = formData.get("price")?.toString().trim() || ""; // obtiene el precio como texto
    const categoryIdValue = formData.get("categoryId")?.toString().trim() || ""; // obtiene el id de la categoría como texto
    const imageUrl = formData.get("imageUrl")?.toString().trim() || ""; // obtiene la URL de imagen

    if (!name || !slug || !description || !priceValue || !categoryIdValue) { // valida campos obligatorios
      throw new Error("Todos los campos obligatorios deben completarse."); // lanza error si falta algo
    }

    const price = Number(priceValue); // convierte el precio a número
    const categoryId = Number(categoryIdValue); // convierte el id de categoría a número

    if (Number.isNaN(price) || Number.isNaN(categoryId)) { // valida que precio y categoría sean números válidos
      throw new Error("Precio o categoría inválidos."); // lanza error si no son válidos
    }

    await prisma.product.create({ // crea un nuevo producto
      data: {
        name, // guarda el nombre
        slug, // guarda el slug
        description, // guarda la descripción
        price, // guarda el precio
        imageUrl: imageUrl || null, // guarda la imagen o null si está vacía
        active: true, // el producto se crea activo por defecto
        category: {
          connect: {
            id: categoryId, // conecta el producto con la categoría elegida
          },
        },
      },
    });

    revalidatePath("/admin/productos"); // refresca la lista de productos
    redirect("/admin/productos?success=1");
  }

  return ( // retorna la interfaz visual
    <main className="min-h-screen p-8"> {/* contenedor principal */}
      <div className="mx-auto max-w-2xl"> {/* centra el contenido y limita el ancho */}
        <h1 className="text-3xl font-bold">Nuevo producto</h1> {/* título principal */}

        <ProductCreateForm
            categories={categories} // envía las categorías al formulario
            action={createProduct} // envía la función que guarda el producto
        />
      </div>
    </main>
  );
}