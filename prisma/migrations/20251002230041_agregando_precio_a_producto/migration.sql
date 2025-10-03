/*
  Warnings:

  - Added the required column `precio` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Producto" ADD COLUMN     "precio" DOUBLE PRECISION NOT NULL;
