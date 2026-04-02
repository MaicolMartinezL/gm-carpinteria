import Link from "next/link"; // importa Link para navegar entre categorías y productos sin recargar toda la app
import { prisma } from "@/lib/prisma"; // importa Prisma para consultar productos y categorías

type CatalogoPageProps = {
  searchParams: Promise<{ categoria?: string; search?: string }>; // ahora también acepta búsqueda por texto
};

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) { // crea la página del catálogo
  const { categoria, search } = await searchParams; // extrae el valor de categoria desde la URL

  const categories = await prisma.category.findMany({ // consulta todas las categorías
    orderBy: {
      name: "asc", // las ordena alfabéticamente
    },
  });

  const products = await prisma.product.findMany({
  where: {
    active: true, // solo productos activos

    ...(categoria // filtro por categoría
      ? {
          category: {
            slug: categoria,
          },
        }
      : {}),

    ...(search // 🔥 filtro por nombre o descripción
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive", // no distingue mayúsculas
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {}),
  },
    include: {
      category: true, // incluye la categoría de cada producto
    },
    orderBy: {
      createdAt: "desc", // ordena del más reciente al más antiguo
    },
  });

  return (
    <main className="min-h-screen"> {/* contenedor principal */}
      <div className="mb-8"> {/* bloque superior del catálogo */}
        <h1 className="text-3xl font-bold">Catálogo de productos</h1> {/* título principal */}
        <p className="mt-2 text-gray-600">Explora nuestros muebles y soluciones en carpintería.</p> {/* texto de apoyo */}
          <form className="mt-4 flex gap-2"> {/* formulario de búsqueda */}
            <input
              type="text"
              name="search"
              defaultValue={search || ""} // mantiene el valor en el input
              placeholder="Buscar productos..." // texto de ayuda
              className="w-full rounded-lg border px-4 py-2"
            />

            {categoria && ( // mantiene la categoría seleccionada
              <input type="hidden" name="categoria" value={categoria} />
            )}

            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Buscar
            </button>
          </form>
      </div>

      <div className="mb-8 flex flex-wrap gap-3"> {/* contenedor de filtros por categoría */}
        <Link
          href="/catalogo" // link para ver todos los productos
          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
            !categoria
              ? "bg-black text-white" // estilo activo cuando no hay categoría seleccionada
              : "bg-white text-gray-700 hover:bg-gray-100" // estilo normal
          }`}
        >
          Todos {/* texto del botón */}
        </Link>

        {categories.map((category) => ( // recorre todas las categorías
          <Link
            key={category.id} // clave única por categoría
            href={`/catalogo?categoria=${category.slug}${search ? `&search=${search}` : ""}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              categoria === category.slug
                ? "bg-black text-white" // estilo activo cuando esta categoría está seleccionada
                : "bg-white text-gray-700 hover:bg-gray-100" // estilo normal
            }`}
          >
            {category.name} {/* nombre visible de la categoría */}
          </Link>
        ))}
      </div>

      {products.length === 0 ? ( // verifica si no hay productos para el filtro seleccionado
        <p>No hay productos disponibles en esta categoría.</p> // mensaje vacío
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> {/* grid responsive de productos */}
          {products.map((product) => ( // recorre todos los productos
            <Link
              key={product.id} // clave única por producto
              href={`/catalogo/${product.slug}`} // link al detalle del producto
              className="rounded-xl border p-5 shadow-sm transition hover:shadow-md" // estilos de la tarjeta
            >
              <article> {/* estructura semántica de cada tarjeta */}
                <h2 className="text-xl font-semibold">{product.name}</h2> {/* nombre del producto */}

                <p className="mt-1 text-sm text-gray-500">
                  Categoría: {product.category.name} {/* nombre de la categoría */}
                </p>

                <p className="mt-3 text-sm text-gray-600">
                  {product.description} {/* descripción del producto */}
                </p>

                <p className="mt-4 text-lg font-bold">
                  ${product.price.toLocaleString("es-CO")} {/* precio formateado */}
                </p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}