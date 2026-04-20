import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type CatalogoPageProps = {
  searchParams: Promise<{ categoria?: string; search?: string }>;
};

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const { categoria, search } = await searchParams;

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const products = await prisma.product.findMany({
    where: {
      active: true,

      ...(categoria
        ? {
            category: {
              slug: categoria,
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                material: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                color: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Catálogo de productos</h1>
        <p className="mt-2 text-gray-600">
          Explora nuestros muebles y soluciones en carpintería.
        </p>

        <form className="mt-4 flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={search || ""}
            placeholder="Buscar productos..."
            className="w-full rounded-lg border px-4 py-2"
          />

          {categoria && <input type="hidden" name="categoria" value={categoria} />}

          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Buscar
          </button>
        </form>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <Link
          href={search ? `/catalogo?search=${encodeURIComponent(search)}` : "/catalogo"}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            !categoria
              ? "bg-black text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Todos
        </Link>

        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/catalogo?categoria=${category.slug}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              categoria === category.slug
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="text-gray-600">
          {search
            ? "No se encontraron productos con los criterios de búsqueda."
            : "No hay productos disponibles en esta categoría."}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const mainImage = product.images[0]?.url || "/placeholder-product.jpg";

            return (
              <Link
                key={product.id}
                href={`/catalogo/${product.slug}`}
                className="overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md"
              >
                <article>
                  <div className="relative h-56 w-full bg-gray-100">
                    <Image
                      src={mainImage}
                      alt={product.images[0]?.altText || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h2 className="text-xl font-semibold">{product.name}</h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Categoría: {product.category.name}
                    </p>

                    {(product.material || product.color) && (
                      <p className="mt-2 text-sm text-gray-500">
                        {product.material ? `Material: ${product.material}` : ""}
                        {product.material && product.color ? " · " : ""}
                        {product.color ? `Color: ${product.color}` : ""}
                      </p>
                    )}

                    <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                      {product.description}
                    </p>

                    <p className="mt-4 text-lg font-bold">
                      ${product.priceBase.toLocaleString("es-CO")}
                    </p>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}