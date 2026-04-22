import Link from "next/link";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import PortfolioForm from "../components/PortfolioForm";
import { createPortfolioProject } from "../actions";

export default async function NewPortfolioProjectPage() {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Nuevo proyecto</h1>
            <p className="mt-2 text-gray-600">
              Crea un proyecto para mostrarlo en el portafolio público.
            </p>
          </div>

          <Link href="/admin/portafolio" className="rounded-lg border px-4 py-2">
            Volver
          </Link>
        </div>

        <PortfolioForm
          action={createPortfolioProject}
          submitLabel="Crear proyecto"
        />
      </div>
    </main>
  );
}