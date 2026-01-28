/*
  Warnings:

  - You are about to drop the column `en_venta` on the `Inventario` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."EstadoOrden" ADD VALUE 'PREPARADA';

-- AlterTable
ALTER TABLE "public"."Inventario" DROP COLUMN "en_venta";

-- AlterTable
ALTER TABLE "public"."PedidoPorOrden" ADD COLUMN     "comentarios" TEXT,
ADD COLUMN     "para_barra" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preparado" BOOLEAN NOT NULL DEFAULT false;
