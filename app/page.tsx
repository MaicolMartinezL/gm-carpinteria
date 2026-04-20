import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: {
      active: true,
    },
    take: 3,
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
    <div className="space-y-16">
      <section className="rounded-2xl bg-amber-700 px-8 py-16 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold leading-tight">
            Carpintería a medida para tu hogar y oficina
          </h1>

          <p className="mt-4 text-amber-100">
            Diseñamos y fabricamos muebles personalizados con materiales de alta
            calidad. Solicita tu cotización y transforma tus espacios.
          </p>

          <div className="mt-6 flex gap-4">
            <Link
              href="/catalogo"
              className="rounded-lg bg-white px-5 py-3 font-medium text-black"
            >
              Ver catálogo
            </Link>

            <Link
              href="/cotizacion"
              className="rounded-lg border border-white px-5 py-3"
            >
              Solicitar cotización
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-3xl">
        <h2 className="text-2xl font-bold">Sobre nosotros</h2>
        <p className="mt-4 text-gray-600">
          En GM Carpintería nos especializamos en la fabricación de muebles a
          medida, ofreciendo soluciones personalizadas para cada cliente.
          Trabajamos con precisión, diseño y materiales de alta calidad.
        </p>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Productos destacados</h2>

          <Link href="/catalogo" className="text-sm underline">
            Ver todos
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => {
              const mainImage =
                product.images[0]?.url || "/placeholder-product.jpg";

              return (
                <Link
                  key={product.id}
                  href={`/catalogo/${product.slug}`}
                  className="overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-56 w-full bg-gray-100">
                    <Image
                      src={mainImage}
                      alt={product.images[0]?.altText || product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold">{product.name}</h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {product.category.name}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                      {product.description}
                    </p>

                    <p className="mt-4 font-bold">
                      ${product.priceBase.toLocaleString("es-CO")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}