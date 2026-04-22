import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import PortfolioForm from "../../components/PortfolioForm";
import { updatePortfolioProject } from "../../actions";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPortfolioProjectPage({ params }: EditPageProps) {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const { id } = await params;
  const projectId = Number(id);

  if (Number.isNaN(projectId)) {
    notFound();
  }

  const project = await prisma.portfolioProject.findUnique({
    where: { id: projectId },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Editar proyecto</h1>
            <p className="mt-2 text-gray-600">
              Actualiza la información del proyecto seleccionado.
            </p>
          </div>

          <Link href="/admin/portafolio" className="rounded-lg border px-4 py-2">
            Volver
          </Link>
        </div>

        <PortfolioForm
          action={updatePortfolioProject}
          submitLabel="Guardar cambios"
          defaultValues={{
            id: project.id,
            title: project.title,
            category: project.category,
            description: project.description,
            location: project.location,
            projectDate: project.projectDate
              ? new Date(project.projectDate).toISOString().split("T")[0]
              : "",
            imageUrl: project.images[0]?.url || "",
            active: project.active,
          }}
        />
      </div>
    </main>
  );
}