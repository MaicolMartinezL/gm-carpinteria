import Link from "next/link"; // importa el componente Link para navegar entre páginas
import { prisma } from "@/lib/prisma"; // importa la conexión de Prisma que ya creaste para consultar la base de datos
import { notFound } from "next/navigation"; // importa la función de Next.js que muestra una página 404 si no encuentra el producto

type ProductPageProps = { // define el tipo de las propiedades que recibirá esta página
  params: Promise<{ slug: string }>; // indica que la ruta traerá un parámetro dinámico llamado slug
};

export default async function ProductPage({ params }: ProductPageProps) { // crea la página dinámica del producto y recibe los parámetros de la URL
  const { slug } = await params; // extrae el slug enviado en la URL, por ejemplo "cocina-integral-basica"

  const product = await prisma.product.findUnique({ // busca un único producto en la base de datos
    where: { slug }, // busca específicamente por el campo slug
    include: { category: true }, // también trae la categoría relacionada del producto
  });

  if (!product) { // verifica si no se encontró ningún producto con ese slug
    notFound(); // si no existe, muestra la página 404 de Next.js
  }

  return ( // retorna el contenido visual de la página
    <main className="min-h-screen p-8"> {/* contenedor principal con altura mínima de pantalla y espacio interno */}
      <div className="mx-auto max-w-3xl"> {/* centra el contenido y limita el ancho máximo */}
        <p className="text-sm text-gray-500">Categoría: {product.category.name}</p> {/* muestra el nombre de la categoría */}
        
        <h1 className="mt-2 text-4xl font-bold">{product.name}</h1> {/* muestra el nombre del producto como título principal */}
        
        <p className="mt-4 text-lg text-gray-700">{product.description}</p> {/* muestra la descripción del producto */}
        
        <p className="mt-6 text-2xl font-semibold"> {/* crea el bloque visual para el precio */}
          ${product.price.toLocaleString("es-CO")} {/* formatea el precio con separadores de miles estilo Colombia */}
        </p>

        <div className="mt-8 flex gap-4"> {/* crea un contenedor para botones con separación entre ellos */}
          <Link
            href={`/cotizacion?product=${product.slug}`} // crea un enlace hacia la página de cotización enviando el slug del producto en la URL
            className="rounded-lg bg-black px-5 py-3 text-white" // aplica estilos para que visualmente se vea como botón
            >
            Solicitar cotización {/* texto que verá el usuario */}
            </Link>

          <a
            href="https://wa.me/573000000000" // crea un enlace directo a WhatsApp, luego cambias este número por el real de la empresa
            target="_blank" // hace que el enlace se abra en una nueva pestaña
            rel="noopener noreferrer" // añade seguridad al abrir enlaces externos
            className="rounded-lg border px-5 py-3" // aplica estilos de borde y espaciado al enlace
          >
            WhatsApp {/* texto del botón secundario */}
          </a>
        </div>
      </div>
    </main>
  );
}