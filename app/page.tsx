import Link from "next/link"; // permite navegar entre páginas sin recargar
import { prisma } from "@/lib/prisma"; // permite consultar productos desde la base de datos

export default async function HomePage() { // crea la página principal del sitio

  const featuredProducts = await prisma.product.findMany({ // consulta algunos productos para mostrar en la home
    where: {
      active: true, // solo productos activos
    },
    take: 3, // trae solo 3 productos (destacados)
    include: {
      category: true, // incluye la categoría
    },
  });

  return (
    <div className="space-y-16"> {/* contenedor general con separación entre secciones */}

      {/* HERO */}
      <section className="rounded-2xl bg-amber-700 px-8 py-16 text-white"> {/* sección principal con fondo oscuro */}
        <div className="max-w-2xl"> {/* limita el ancho del contenido */}
          <h1 className="text-4xl font-bold leading-tight"> {/* título principal */}
            Carpintería a medida para tu hogar y oficina
          </h1>

          <p className="mt-4 text-gray-300"> {/* descripción */}
            Diseñamos y fabricamos muebles personalizados con materiales de alta calidad.
            Solicita tu cotización y transforma tus espacios.
          </p>

          <div className="mt-6 flex gap-4"> {/* contenedor de botones */}
            <Link
              href="/catalogo" // lleva al catálogo
              className="rounded-lg bg-white px-5 py-3 text-black font-medium"
            >
              Ver catálogo
            </Link>

            <Link
              href="/cotizacion" // lleva a cotización general
              className="rounded-lg border border-white px-5 py-3"
            >
              Solicitar cotización
            </Link>
          </div>
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section className="max-w-3xl"> {/* sección de información */}
        <h2 className="text-2xl font-bold">Sobre nosotros</h2> {/* título */}
        <p className="mt-4 text-gray-600"> {/* texto */}
          En GM Carpintería nos especializamos en la fabricación de muebles a medida,
          ofreciendo soluciones personalizadas para cada cliente. Trabajamos con precisión,
          diseño y materiales de alta calidad.
        </p>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section> {/* sección de productos */}
        <div className="mb-6 flex items-center justify-between"> {/* encabezado */}
          <h2 className="text-2xl font-bold">Productos destacados</h2>

          <Link href="/catalogo" className="text-sm underline"> {/* link al catálogo */}
            Ver todos
          </Link>
        </div>

        {featuredProducts.length === 0 ? ( // si no hay productos
          <p>No hay productos disponibles.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> {/* grid de productos */}
            {featuredProducts.map((product) => ( // recorre productos
              <Link
                key={product.id}
                href={`/catalogo/${product.slug}`} // link al detalle
                className="rounded-xl border p-5 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold">{product.name}</h3> {/* nombre */}

                <p className="mt-1 text-sm text-gray-500">
                  {product.category.name} {/* categoría */}
                </p>

                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                  {product.description} {/* descripción corta */}
                </p>

                <p className="mt-4 font-bold">
                  ${product.price.toLocaleString("es-CO")} {/* precio */}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
