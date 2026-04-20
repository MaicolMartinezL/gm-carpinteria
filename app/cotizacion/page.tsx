import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

type CotizacionPageProps = {
  searchParams: Promise<{ product?: string }>;
};

export default async function CotizacionPage({ searchParams }: CotizacionPageProps) {
  const { product: productSlug } = await searchParams;

  const product = productSlug
    ? await prisma.product.findUnique({
        where: { slug: productSlug },
        include: {
          images: {
            orderBy: {
              sortOrder: "asc",
            },
          },
          category: true,
        },
      })
    : null;

  async function createQuote(formData: FormData) {
    "use server";

    const customerName = formData.get("customerName")?.toString().trim() || "";
    const customerEmail = formData.get("customerEmail")?.toString().trim() || "";
    const customerPhone = formData.get("customerPhone")?.toString().trim() || "";
    const needsDescription =
      formData.get("needsDescription")?.toString().trim() || "";
    const productIdValue = formData.get("productId")?.toString() || "";

    if (!customerName || !customerEmail || !needsDescription || !productIdValue) {
      throw new Error("Los campos obligatorios no fueron diligenciados.");
    }

    const productId = Number(productIdValue);

    if (Number.isNaN(productId)) {
      throw new Error("El producto seleccionado no es válido.");
    }

    const selectedProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, active: true },
    });

    if (!selectedProduct || !selectedProduct.active) {
      throw new Error("El producto seleccionado no está disponible.");
    }

    await prisma.quote.create({
      data: {
        customerName,
        customerEmail,
        customerPhone: customerPhone || null,
        needsDescription,
        items: {
          create: [
            {
              productId: selectedProduct.id,
              quantity: 1,
            },
          ],
        },
      },
    });

    redirect("/cotizacion/exito");
  }

  if (!product || !product.active) {
    return (
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold">Producto no encontrado</h1>
          <p className="mt-4 text-gray-600">
            Debes entrar a este formulario desde un producto del catálogo.
          </p>
        </div>
      </main>
    );
  }

  const productImage = product.images[0]?.url || "/placeholder-product.jpg";

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
        <section>
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <img
              src={productImage}
              alt={product.images[0]?.altText || product.name}
              className="h-72 w-full object-cover"
            />

            <div className="p-5">
              <p className="text-sm text-gray-500">Categoría: {product.category.name}</p>
              <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>

              <p className="mt-4 text-gray-700">{product.description}</p>

              <div className="mt-4 space-y-1 text-sm text-gray-600">
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
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold">Solicitar cotización</h2>
          <p className="mt-2 text-gray-600">
            Estás cotizando: <span className="font-semibold">{product.name}</span>
          </p>

          <form action={createQuote} className="mt-8 space-y-5">
            <input type="hidden" name="productId" value={product.id} />

            <div>
              <label htmlFor="customerName" className="mb-2 block font-medium">
                Nombre completo
              </label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                required
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="customerEmail" className="mb-2 block font-medium">
                Correo electrónico
              </label>
              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                required
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="customerPhone" className="mb-2 block font-medium">
                Teléfono
              </label>
              <input
                id="customerPhone"
                name="customerPhone"
                type="text"
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="needsDescription" className="mb-2 block font-medium">
                Detalles de la cotización
              </label>
              <textarea
                id="needsDescription"
                name="needsDescription"
                required
                rows={5}
                className="w-full rounded-lg border px-4 py-3"
                placeholder={`Hola, quiero cotizar el producto "${product.name}".`}
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-black px-5 py-3 text-white"
            >
              Enviar cotización
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}