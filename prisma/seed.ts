import "dotenv/config";
import {
  PrismaClient,
  UserRole,
  UserStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida en .env");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function upsertCategory(name: string, slug: string, description: string) {
  return prisma.category.upsert({
    where: { slug },
    update: {
      name,
      description,
    },
    create: {
      name,
      slug,
      description,
    },
  });
}

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin123*", 10);
  const clientPasswordHash = await bcrypt.hash("Cliente123*", 10);

  await prisma.user.upsert({
    where: { email: "admin@gmcarpinteria.com" },
    update: {
      name: "Administrador GM",
      phone: "3000000001",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: "Administrador GM",
      email: "admin@gmcarpinteria.com",
      phone: "3000000001",
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.user.upsert({
    where: { email: "cliente@gmcarpinteria.com" },
    update: {
      name: "Cliente Demo",
      phone: "3000000002",
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: "Cliente Demo",
      email: "cliente@gmcarpinteria.com",
      phone: "3000000002",
      passwordHash: clientPasswordHash,
      role: UserRole.CLIENT,
      status: UserStatus.ACTIVE,
    },
  });

  await upsertCategory(
    "Salas",
    "salas",
    "Muebles y soluciones para sala."
  );

  await upsertCategory(
    "Cocinas",
    "cocinas",
    "Cocinas integrales y modulares."
  );

  await upsertCategory(
    "Oficina",
    "oficina",
    "Muebles de oficina en madera."
  );

  await upsertCategory(
    "Baños",
    "banos",
    "Muebles y soluciones para baños."
  );

  await upsertCategory(
    "Puertas",
    "puertas",
    "Puertas y diseños en madera."
  );

  await upsertCategory(
    "Muebles",
    "muebles",
    "Muebles personalizados para el hogar."
  );

  await upsertCategory(
    "Lavadero",
    "lavadero",
    "Muebles y soluciones para zona de lavado."
  );

  await upsertCategory(
    "Habitaciones",
    "habitaciones",
    "Closets, camas y muebles para habitación."
  );

  console.log("Seed seguro ejecutado correctamente.");
  console.log("No se borraron productos, portafolio, cotizaciones, citas ni mensajes.");
  console.log("Admin: admin@gmcarpinteria.com / Admin123*");
  console.log("Cliente: cliente@gmcarpinteria.com / Cliente123*");
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