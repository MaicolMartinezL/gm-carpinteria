import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida en .env");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const sala = await prisma.category.create({
    data: {
      name: "Salas",
      slug: "salas",
    },
  });

  const cocina = await prisma.category.create({
    data: {
      name: "Cocinas",
      slug: "cocinas",
    },
  });

  const oficina = await prisma.category.create({
    data: {
      name: "Oficina",
      slug: "oficina",
    },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Centro de entretenimiento moderno",
        slug: "centro-entretenimiento-moderno",
        description: "Mueble en madera para sala con diseño moderno.",
        price: 1500000,
        imageUrl: "/products/centro.jpg",
        categoryId: sala.id,
        active: true,
      },
      {
        name: "Cocina integral básica",
        slug: "cocina-integral-basica",
        description: "Cocina integral funcional con acabados resistentes.",
        price: 3200000,
        imageUrl: "/products/cocina.jpg",
        categoryId: cocina.id,
        active: true,
      },
      {
        name: "Escritorio ejecutivo",
        slug: "escritorio-ejecutivo",
        description: "Escritorio de oficina en madera con cajones laterales.",
        price: 980000,
        imageUrl: "/products/escritorio.jpg",
        categoryId: oficina.id,
        active: true,
      },
    ],
  });

  console.log("Seed completado");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });