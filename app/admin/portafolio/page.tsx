import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { deletePortfolioProject } from "./actions";
import DeletePortfolioButton from "./components/DeletePortfolioButton";

export default async function AdminPortfolioPage() {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const projects = await prisma.portfolioProject.findMany({
    include: {
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
            <h1 className="text-3xl font-bold">Gestión de portafolio</h1>
            <p className="mt-2 text-gray-600">
              Administra los proyectos mostrados en el portafolio público.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin"
              className="rounded-lg border px-4 py-2"
            >
              Volver al dashboard
            </Link>

            <Link
              href="/admin/portafolio/nuevo"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Nuevo proyecto
            </Link>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <h2 className="text-xl font-semibold">No hay proyectos registrados</h2>
            <p className="mt-3 text-gray-600">
              Crea un proyecto para mostrarlo en el portafolio.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-xl border p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{project.category}</p>
                    <h2 className="mt-1 text-xl font-semibold">{project.title}</h2>
                    <p className="mt-2 text-sm text-gray-600">
                      Estado: {project.active ? "Activo" : "Inactivo"}
                    </p>
                    {project.location && (
                      <p className="mt-1 text-sm text-gray-600">
                        Ubicación: {project.location}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/portafolio/${project.slug}`}
                      className="rounded-lg border px-4 py-2 text-sm"
                    >
                      Ver público
                    </Link>

                    <Link
                      href={`/admin/portafolio/${project.id}/editar`}
                      className="rounded-lg border px-4 py-2 text-sm"
                    >
                      Editar
                    </Link>

                    <DeletePortfolioButton projectId={project.id} />
                  </div>
                </div>

                <p className="mt-4 text-sm text-gray-700">{project.description}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}