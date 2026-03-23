import { prisma } from "@/lib/prisma";

export default async function CatalogoPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Catálogo de productos</h1>

      {products.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-xl border p-5 shadow-sm"
            >
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Categoría: {product.category.name}
              </p>
              <p className="mt-3 text-sm">{product.description}</p>
              <p className="mt-4 text-lg font-bold">
                ${product.price.toLocaleString("es-CO")}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}