import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { deleteProduct } from "./actions";
import DeleteProductButton from "./components/DeleteProductButton";

export default async function AdminProductsPage() {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const products = await prisma.product.findMany({
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
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de productos</h1>
            <p className="mt-2 text-gray-600">
              Administra los productos visibles en el catálogo.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/admin" className="rounded-lg border px-4 py-2">
              Volver al dashboard
            </Link>

            <Link
              href="/admin/productos/nuevo"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Nuevo producto
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <h2 className="text-xl font-semibold">No hay productos registrados</h2>
            <p className="mt-3 text-gray-600">
              Crea un producto para mostrarlo en el catálogo.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {products.map((product) => (
              <article key={product.id} className="rounded-xl border p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{product.category.name}</p>
                    <h2 className="mt-1 text-xl font-semibold">{product.name}</h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Estado: {product.active ? "Activo" : "Inactivo"}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      ${product.priceBase.toLocaleString("es-CO")}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/catalogo/${product.slug}`}
                      className="rounded-lg border px-4 py-2 text-sm"
                    >
                      Ver público
                    </Link>

                    <Link
                      href={`/admin/productos/${product.id}/editar`}
                      className="rounded-lg border px-4 py-2 text-sm"
                    >
                      Editar
                    </Link>

                    <DeleteProductButton productId={product.id} />
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-700">{product.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}