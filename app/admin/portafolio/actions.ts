"use server";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export type PortfolioState = {
  error?: string;
  success?: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function ensureAdmin() {
  const session = await verifySession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }
}

export async function createPortfolioProject(
  _prevState: PortfolioState | void,
  formData: FormData
): Promise<PortfolioState | void> {
  await ensureAdmin();

  const title = formData.get("title")?.toString().trim() || "";
  const category = formData.get("category")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const location = formData.get("location")?.toString().trim() || "";
  const projectDate = formData.get("projectDate")?.toString() || "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() || "";

  if (!title || !category || !description) {
    return { error: "Completa los campos obligatorios." };
  }

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;

  while (
    await prisma.portfolioProject.findUnique({
      where: { slug },
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  await prisma.portfolioProject.create({
    data: {
      title,
      slug,
      category,
      description,
      location: location || null,
      projectDate: projectDate ? new Date(projectDate) : null,
      active: true,
      images: imageUrl
        ? {
            create: [
              {
                url: imageUrl,
                altText: title,
                sortOrder: 0,
              },
            ],
          }
        : undefined,
    },
  });

  return { success: "Proyecto creado correctamente." };
}

export async function updatePortfolioProject(
  _prevState: PortfolioState | void,
  formData: FormData
): Promise<PortfolioState | void> {
  await ensureAdmin();

  const projectIdValue = formData.get("projectId")?.toString() || "";
  const title = formData.get("title")?.toString().trim() || "";
  const category = formData.get("category")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const location = formData.get("location")?.toString().trim() || "";
  const projectDate = formData.get("projectDate")?.toString() || "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() || "";
  const activeValue = formData.get("active")?.toString();

  const projectId = Number(projectIdValue);

  if (Number.isNaN(projectId)) {
    return { error: "El proyecto no es válido." };
  }

  if (!title || !category || !description) {
    return { error: "Completa los campos obligatorios." };
  }

  const project = await prisma.portfolioProject.findUnique({
    where: { id: projectId },
    include: { images: true },
  });

  if (!project) {
    return { error: "El proyecto no existe." };
  }

  await prisma.portfolioProject.update({
    where: { id: projectId },
    data: {
      title,
      category,
      description,
      location: location || null,
      projectDate: projectDate ? new Date(projectDate) : null,
      active: activeValue === "on",
    },
  });

  if (imageUrl) {
    if (project.images.length > 0) {
      await prisma.portfolioImage.update({
        where: { id: project.images[0].id },
        data: {
          url: imageUrl,
          altText: title,
        },
      });
    } else {
      await prisma.portfolioImage.create({
        data: {
          url: imageUrl,
          altText: title,
          sortOrder: 0,
          projectId: project.id,
        },
      });
    }
  }

  return { success: "Proyecto actualizado correctamente." };
}

export async function deletePortfolioProject(formData: FormData) {
  await ensureAdmin();

  const projectIdValue = formData.get("projectId")?.toString() || "";
  const projectId = Number(projectIdValue);

  if (Number.isNaN(projectId)) {
    throw new Error("Proyecto inválido.");
  }

  await prisma.portfolioProject.deleteMany({
    where: { id: projectId },
  });
}