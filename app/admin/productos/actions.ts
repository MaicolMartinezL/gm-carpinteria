"use server";

import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export type ProductState = {
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

export async function createProduct(
  _prevState: ProductState | void,
  formData: FormData
): Promise<ProductState | void> {
  await ensureAdmin();

  const name = formData.get("name")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const material = formData.get("material")?.toString().trim() || "";
  const color = formData.get("color")?.toString().trim() || "";
  const priceBaseValue = formData.get("priceBase")?.toString() || "";
  const categoryIdValue = formData.get("categoryId")?.toString() || "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() || "";

  if (!name || !description || !priceBaseValue || !categoryIdValue) {
    return { error: "Completa los campos obligatorios." };
  }

  const priceBase = Number(priceBaseValue);
  const categoryId = Number(categoryIdValue);

  if (Number.isNaN(priceBase) || priceBase <= 0) {
    return { error: "El precio base no es válido." };
  }

  if (Number.isNaN(categoryId)) {
    return { error: "La categoría no es válida." };
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    return { error: "La categoría seleccionada no existe." };
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 1;

  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix++;
  }

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      material: material || null,
      color: color || null,
      priceBase,
      active: true,
      categoryId,
      images: imageUrl
        ? {
            create: [
              {
                url: imageUrl,
                altText: name,
                sortOrder: 0,
              },
            ],
          }
        : undefined,
    },
  });

  return { success: "Producto creado correctamente." };
}

export async function updateProduct(
  _prevState: ProductState | void,
  formData: FormData
): Promise<ProductState | void> {
  await ensureAdmin();

  const productIdValue = formData.get("productId")?.toString() || "";
  const name = formData.get("name")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const material = formData.get("material")?.toString().trim() || "";
  const color = formData.get("color")?.toString().trim() || "";
  const priceBaseValue = formData.get("priceBase")?.toString() || "";
  const categoryIdValue = formData.get("categoryId")?.toString() || "";
  const imageUrl = formData.get("imageUrl")?.toString().trim() || "";
  const activeValue = formData.get("active")?.toString();

  const productId = Number(productIdValue);
  const priceBase = Number(priceBaseValue);
  const categoryId = Number(categoryIdValue);

  if (Number.isNaN(productId)) {
    return { error: "El producto no es válido." };
  }

  if (!name || !description || !priceBaseValue || !categoryIdValue) {
    return { error: "Completa los campos obligatorios." };
  }

  if (Number.isNaN(priceBase) || priceBase <= 0) {
    return { error: "El precio base no es válido." };
  }

  if (Number.isNaN(categoryId)) {
    return { error: "La categoría no es válida." };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  if (!product) {
    return { error: "El producto no existe." };
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      material: material || null,
      color: color || null,
      priceBase,
      categoryId,
      active: activeValue === "on",
    },
  });

  if (imageUrl) {
    if (product.images.length > 0) {
      await prisma.productImage.update({
        where: { id: product.images[0].id },
        data: {
          url: imageUrl,
          altText: name,
        },
      });
    } else {
      await prisma.productImage.create({
        data: {
          url: imageUrl,
          altText: name,
          sortOrder: 0,
          productId: product.id,
        },
      });
    }
  }

  return { success: "Producto actualizado correctamente." };
}

export async function deleteProduct(formData: FormData) {
  await ensureAdmin();

  const productIdValue = formData.get("productId")?.toString() || "";
  const productId = Number(productIdValue);

  if (Number.isNaN(productId)) {
    throw new Error("Producto inválido.");
  }

  await prisma.product.deleteMany({
    where: { id: productId },
  });
}