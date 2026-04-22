import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import ProductForm from "../../components/ProductForm";
import { updateProduct } from "../../actions";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const { id } = await params;
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    notFound();
  }

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Editar producto</h1>
            <p className="mt-2 text-gray-600">
              Actualiza la información del producto seleccionado.
            </p>
          </div>

          <Link href="/admin/productos" className="rounded-lg border px-4 py-2">
            Volver
          </Link>
        </div>

        <ProductForm
          action={updateProduct}
          categories={categories}
          submitLabel="Guardar cambios"
          defaultValues={{
            id: product.id,
            name: product.name,
            description: product.description,
            material: product.material,
            color: product.color,
            priceBase: product.priceBase,
            categoryId: product.categoryId,
            imageUrl: product.images[0]?.url || "",
            active: product.active,
          }}
        />
      </div>
    </main>
  );
}