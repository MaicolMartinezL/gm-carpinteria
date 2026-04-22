import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../actions";

export default async function NewProductPage() {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Nuevo producto</h1>
            <p className="mt-2 text-gray-600">
              Crea un producto para el catálogo público.
            </p>
          </div>

          <Link href="/admin/productos" className="rounded-lg border px-4 py-2">
            Volver
          </Link>
        </div>

        <ProductForm
          action={createProduct}
          categories={categories}
          submitLabel="Crear producto"
        />
      </div>
    </main>
  );
}