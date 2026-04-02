import { redirect } from "next/navigation"; // permite redirigir si no hay sesión o al guardar
import { revalidatePath } from "next/cache"; // permite refrescar la lista de productos después de editar
import { prisma } from "@/lib/prisma"; // importa Prisma para consultar y actualizar datos
import { verifySession } from "@/lib/auth"; // importa la verificación de sesión

type EditProductPageProps = { // define el tipo de props que recibe la página
  params: Promise<{ id: string }>; // recibe el id desde la URL
};

export default async function EditProductPage({ params }: EditProductPageProps) { // crea la página de edición
  const { id } = await params; // obtiene el id desde la URL

  const session = await verifySession(); // verifica sesión

  if (!session || session.role !== "ADMIN") { // valida que sea admin
    redirect("/admin/login"); // redirige si no lo es
  }

  const productId = Number(id); // convierte el id a número

  if (Number.isNaN(productId)) { // valida que el id sea válido
    throw new Error("ID inválido");
  }

  const product = await prisma.product.findUnique({ // busca el producto
    where: { id: productId }, // por id
  });

  if (!product) { // si no existe
    throw new Error("Producto no encontrado");
  }

  const categories = await prisma.category.findMany({ // trae categorías
    orderBy: { name: "asc" }, // ordenadas
  });

  async function updateProduct(formData: FormData) { // server action para actualizar
    "use server";

    const session = await verifySession(); // vuelve a verificar sesión

    if (!session || session.role !== "ADMIN") {
      throw new Error("No autorizado");
    }

    const name = formData.get("name")?.toString().trim() || ""; // nombre
    const slug = formData.get("slug")?.toString().trim() || ""; // slug
    const description = formData.get("description")?.toString().trim() || ""; // descripción
    const priceValue = formData.get("price")?.toString() || ""; // precio texto
    const categoryIdValue = formData.get("categoryId")?.toString() || ""; // categoría texto

    const price = Number(priceValue); // convierte precio
    const categoryId = Number(categoryIdValue); // convierte categoría

    if (!name || !slug || !description || Number.isNaN(price) || Number.isNaN(categoryId)) {
      throw new Error("Datos inválidos");
    }

    await prisma.product.update({ // actualiza el producto
      where: { id: productId }, // por id
      data: {
        name,
        slug,
        description,
        price,
        category: {
          connect: { id: categoryId }, // conecta nueva categoría
        },
      },
    });

    revalidatePath("/admin/productos"); // refresca lista
    redirect("/admin/productos"); // vuelve al listado
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">Editar producto</h1>

        <form action={updateProduct} className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block font-medium">Nombre</label>
            <input
              name="name"
              defaultValue={product.name}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Slug</label>
            <input
              name="slug"
              defaultValue={product.slug}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Descripción</label>
            <textarea
              name="description"
              defaultValue={product.description}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Precio</label>
            <input
              name="price"
              type="number"
              defaultValue={product.price}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Categoría</label>
            <select
              name="categoryId"
              defaultValue={product.categoryId}
              className="w-full rounded-lg border px-4 py-3"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button className="rounded-lg bg-black px-5 py-3 text-white">
            Guardar cambios
          </button>
        </form>
      </div>
    </main>
  );
}