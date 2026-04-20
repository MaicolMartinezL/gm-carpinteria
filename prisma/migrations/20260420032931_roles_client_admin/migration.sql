/*
  Warnings:

  - The values [ADVISOR] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `assignedAdvisorId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `advisorResponse` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `assignedAdvisorId` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('CLIENT', 'ADMIN');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_assignedAdvisorId_fkey";

-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_assignedAdvisorId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "assignedAdvisorId";

-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "advisorResponse",
DROP COLUMN "assignedAdvisorId",
ADD COLUMN     "adminResponse" TEXT;
