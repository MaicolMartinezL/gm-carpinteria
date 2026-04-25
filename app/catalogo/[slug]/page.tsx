import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToQuoteButton from "@/components/add-to-quote-button";
import ImageLightbox from "@/components/image-lightbox";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!product || !product.active) {
    notFound();
  }

  
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm text-gray-500">Categoría: {product.category.name}</p>

        <h1 className="mt-2 text-4xl font-bold">{product.name}</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <ImageLightbox
              images={
                product.images.length > 0
                  ? product.images
                  : [
                      {
                        id: 0,
                        url: "/placeholder-product.jpg",
                        altText: product.name,
                      },
                    ]
              }
              title={product.name}
            />
          </div>

          <div>
            <p className="text-lg text-gray-700">{product.description}</p>

            <div className="mt-6 space-y-2 text-sm text-gray-600">
              {product.material && (
                <p>
                  <span className="font-medium">Material:</span> {product.material}
                </p>
              )}
              {product.color && (
                <p>
                  <span className="font-medium">Color:</span> {product.color}
                </p>
              )}
            </div>

            <p className="mt-6 text-2xl font-semibold">
              ${product.priceBase.toLocaleString("es-CO")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/cotizacion?product=${product.slug}`}
                className="rounded-lg bg-black px-5 py-3 text-white"
              >
                Solicitar cotización
              </Link>

              <AddToQuoteButton
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  priceBase: product.priceBase,
                  imageUrl: product.images[0]?.url || null,
                }}
              />
              <Link
                href="/cotizacion/seleccion"
                className="rounded-lg border px-5 py-3"
              >
                Ver selección
              </Link>
              
              <a
                href={`https://wa.me/573044170401?text=${encodeURIComponent(
                  `Hola, quiero cotizar el producto "${product.name}"`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border px-5 py-3"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}