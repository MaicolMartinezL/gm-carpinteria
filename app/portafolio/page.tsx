import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{
  categoria?: string;
}>;

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { categoria } = await searchParams;

  const projects = await prisma.portfolioProject.findMany({
    where: {
      active: true,
      ...(categoria
        ? {
            category: categoria,
          }
        : {}),
    },
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

  const categories = await prisma.portfolioProject.findMany({
    where: {
      active: true,
    },
    select: {
      category: true,
    },
    distinct: ["category"],
    orderBy: {
      category: "asc",
    },
  });

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Portafolio</h1>
          <p className="mt-2 text-gray-600">
            Conoce algunos de los trabajos realizados por GM Carpintería.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/portafolio"
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              !categoria
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Todos
          </Link>

          {categories.map((item) => (
            <Link
              key={item.category}
              href={`/portafolio?categoria=${encodeURIComponent(item.category)}`}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                categoria === item.category
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.category}
            </Link>
          ))}
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border p-8 text-center">
            <h2 className="text-xl font-semibold">No hay proyectos publicados</h2>
            <p className="mt-3 text-gray-600">
              Aún no hay trabajos visibles en esta categoría.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              const mainImage =
                project.images[0]?.url || "/placeholder-product.jpg";

              return (
                <Link
                  key={project.id}
                  href={`/portafolio/${project.slug}`}
                  className="overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-56 w-full bg-gray-100">
                    <Image
                      src={mainImage}
                      alt={project.images[0]?.altText || project.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-sm text-gray-500">{project.category}</p>

                    <h2 className="mt-2 text-xl font-semibold">{project.title}</h2>

                    {project.location && (
                      <p className="mt-2 text-sm text-gray-500">
                        Ubicación: {project.location}
                      </p>
                    )}

                    <p className="mt-3 line-clamp-3 text-sm text-gray-600">
                      {project.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}