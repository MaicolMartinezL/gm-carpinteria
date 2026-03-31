import Link from "next/link"; // importa el componente Link de Next.js para navegar entre páginas sin recargar todo
import { prisma } from "@/lib/prisma"; // importa la instancia de Prisma para consultar productos

export default async function CatalogoPage() { // crea la página principal del catálogo
  const products = await prisma.product.findMany({ // consulta todos los productos en la base de datos
    include: {
      category: true, // incluye la categoría relacionada de cada producto
    },
    orderBy: {
      createdAt: "desc", // ordena los productos desde el más reciente al más antiguo
    },
  });

  return ( // retorna el contenido visual de la página
    <main className="min-h-screen p-8"> {/* contenedor principal con altura mínima completa y espacio interno */}
      <h1 className="mb-6 text-3xl font-bold">Catálogo de productos</h1> {/* título principal de la página */}

      {products.length === 0 ? ( // verifica si no hay productos registrados
        <p>No hay productos disponibles.</p> // muestra mensaje si la lista está vacía
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> {/* crea una cuadrícula responsive para mostrar tarjetas */}
          {products.map((product) => ( // recorre todos los productos para pintar una tarjeta por cada uno
            <Link
              key={product.id} // clave única para que React identifique cada elemento
              href={`/catalogo/${product.slug}`} // crea el enlace dinámico al detalle del producto usando su slug
              className="rounded-xl border p-5 shadow-sm transition hover:shadow-md" // estilos de tarjeta y efecto hover
            >
              <article> {/* estructura semántica para cada producto */}
                <h2 className="text-xl font-semibold">{product.name}</h2> {/* muestra el nombre del producto */}
                
                <p className="mt-1 text-sm text-gray-500"> {/* texto pequeño para la categoría */}
                  Categoría: {product.category.name} {/* muestra el nombre de la categoría */}
                </p>
                
                <p className="mt-3 text-sm">{product.description}</p> {/* muestra la descripción corta */}
                
                <p className="mt-4 text-lg font-bold"> {/* bloque de precio */}
                  ${product.price.toLocaleString("es-CO")} {/* muestra el precio con formato colombiano */}
                </p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}