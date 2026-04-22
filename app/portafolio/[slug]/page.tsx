import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PortfolioProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project = await prisma.portfolioProject.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!project || !project.active) {
    notFound();
  }

  const mainImage = project.images[0]?.url || "/placeholder-product.jpg";

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/portafolio" className="text-sm underline">
          Volver al portafolio
        </Link>

        <p className="mt-6 text-sm text-gray-500">{project.category}</p>
        <h1 className="mt-2 text-4xl font-bold">{project.title}</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <div className="relative h-80 w-full overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={mainImage}
                alt={project.images[0]?.altText || project.title}
                fill
                className="object-cover"
              />
            </div>

            {project.images.length > 1 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {project.images.slice(1).map((image) => (
                  <div
                    key={image.id}
                    className="relative h-28 overflow-hidden rounded-lg bg-gray-100"
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-lg text-gray-700">{project.description}</p>

            <div className="mt-6 space-y-2 text-sm text-gray-600">
              {project.location && (
                <p>
                  <span className="font-medium">Ubicación:</span> {project.location}
                </p>
              )}

              {project.projectDate && (
                <p>
                  <span className="font-medium">Fecha:</span>{" "}
                  {new Date(project.projectDate).toLocaleDateString("es-CO")}
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/cotizacion"
                className="rounded-lg bg-black px-5 py-3 text-white"
              >
                Solicitar cotización
              </Link>

              <a
                href="https://wa.me/573000000000"
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