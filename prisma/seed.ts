import "dotenv/config";
import {
  PrismaClient,
  UserRole,
  UserStatus,
  QuoteStatus,
  AppointmentStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida en .env");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin123*", 10);
  const clientPasswordHash = await bcrypt.hash("Cliente123*", 10);

  await prisma.quoteAttachment.deleteMany();
  await prisma.quoteItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.portfolioImage.deleteMany();
  await prisma.portfolioProject.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Administrador GM",
      email: "admin@gmcarpinteria.com",
      phone: "3000000001",
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const client = await prisma.user.create({
    data: {
      name: "Cliente Demo",
      email: "cliente@gmcarpinteria.com",
      phone: "3000000002",
      passwordHash: clientPasswordHash,
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
    },
  });

  const sala = await prisma.category.create({
    data: {
      name: "Salas",
      slug: "salas",
      description: "Muebles y soluciones para sala.",
    },
  });

  const cocina = await prisma.category.create({
    data: {
      name: "Cocinas",
      slug: "cocinas",
      description: "Cocinas integrales y modulares.",
    },
  });

  const oficina = await prisma.category.create({
    data: {
      name: "Oficina",
      slug: "oficina",
      description: "Muebles de oficina en madera.",
    },
  });

  const centroEntretenimiento = await prisma.product.create({
    data: {
      name: "Centro de entretenimiento moderno",
      slug: "centro-entretenimiento-moderno",
      description: "Mueble en madera para sala con diseño moderno.",
      material: "Madera Cedro",
      color: "Nogal",
      priceBase: 1500000,
      categoryId: sala.id,
      active: true,
      images: {
        create: [
          {
            url: "/products/centro.jpg",
            altText: "Centro de entretenimiento moderno",
            sortOrder: 0,
          },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: "Cocina integral básica",
      slug: "cocina-integral-basica",
      description: "Cocina integral funcional con acabados resistentes.",
      material: "Melamina",
      color: "Blanco",
      priceBase: 3200000,
      categoryId: cocina.id,
      active: true,
      images: {
        create: [
          {
            url: "/products/cocina.jpg",
            altText: "Cocina integral básica",
            sortOrder: 0,
          },
        ],
      },
    },
  });

  const escritorio = await prisma.product.create({
    data: {
      name: "Escritorio ejecutivo",
      slug: "escritorio-ejecutivo",
      description: "Escritorio de oficina en madera con cajones laterales.",
      material: "Madera Cedro",
      color: "Caoba",
      priceBase: 980000,
      categoryId: oficina.id,
      active: true,
      images: {
        create: [
          {
            url: "/products/escritorio.jpg",
            altText: "Escritorio ejecutivo",
            sortOrder: 0,
          },
        ],
      },
    },
  });

  await prisma.portfolioProject.create({
    data: {
      title: "Remodelación de cocina familiar",
      slug: "remodelacion-cocina-familiar",
      category: "Cocinas",
      description:
        "Proyecto de cocina integral con acabados modernos y optimización de espacio.",
      location: "Bogotá",
      active: true,
      images: {
        create: [
          {
            url: "/portfolio/cocina-proyecto-1.jpg",
            altText: "Proyecto de cocina terminada",
            sortOrder: 0,
          },
        ],
      },
    },
  });

  await prisma.quote.create({
    data: {
      customerName: client.name,
      customerEmail: client.email,
      customerPhone: client.phone ?? undefined,
      needsDescription:
        "Quiero una cotización para adecuar la sala y un escritorio para estudio.",
      status: QuoteStatus.NEW,
      customerId: client.id,
      items: {
        create: [
          {
            productId: centroEntretenimiento.id,
            quantity: 1,
            notes: "Con espacio para televisor de 55 pulgadas.",
          },
          {
            productId: escritorio.id,
            quantity: 1,
            notes: "Con pasacables y cajonera lateral.",
          },
        ],
      },
      attachments: {
        create: [
          {
            url: "/quotes/referencia-sala.png",
            fileName: "referencia-sala.png",
            mimeType: "image/png",
            sizeBytes: 245000,
          },
        ],
      },
    },
  });

  await prisma.appointment.create({
    data: {
      customerName: client.name,
      customerEmail: client.email,
      customerPhone: client.phone ?? undefined,
      notes: "Quiero asesoría para cocina integral.",
      scheduledAt: new Date("2026-05-10T15:00:00.000Z"),
      status: AppointmentStatus.PENDING,
      customerId: client.id,
    },
  });

  await prisma.contactMessage.create({
    data: {
      name: "Visitante Web",
      email: "visitante@example.com",
      phone: "3000000003",
      message: "Quisiera información sobre closets personalizados.",
      isRead: false,
    },
  });

  console.log("Seed completado correctamente");
  console.log("Admin: admin@gmcarpinteria.com / Admin123*");
  console.log("Cliente: cliente@gmcarpinteria.com / Cliente123*");

  void admin;
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error("Error ejecutando seed:", error);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });