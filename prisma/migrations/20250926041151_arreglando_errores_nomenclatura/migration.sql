/*
  Warnings:

  - The `estado_actual` column on the `Mesa` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estado_orden` column on the `Orden` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `contraseña` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `Movimientos_inventario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pedido_por_orden` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contrasena` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."EstadoMesa" AS ENUM ('DISPONIBLE', 'OCUPADO');

-- CreateEnum
CREATE TYPE "public"."TipoInventarioMovimiento" AS ENUM ('VENTA', 'DEVOLUCION', 'INGRESO');

-- CreateEnum
CREATE TYPE "public"."EstadoOrden" AS ENUM ('PAGADA', 'PENDIENTE', 'CANCELADA');

-- DropForeignKey
ALTER TABLE "public"."Movimientos_inventario" DROP CONSTRAINT "Movimientos_inventario_producto_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pedido_por_orden" DROP CONSTRAINT "Pedido_por_orden_orden_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pedido_por_orden" DROP CONSTRAINT "Pedido_por_orden_producto_id_fkey";

-- AlterTable
ALTER TABLE "public"."Mesa" DROP COLUMN "estado_actual",
ADD COLUMN     "estado_actual" "public"."EstadoMesa" NOT NULL DEFAULT 'DISPONIBLE';

-- AlterTable
ALTER TABLE "public"."Orden" DROP COLUMN "estado_orden",
ADD COLUMN     "estado_orden" "public"."EstadoOrden" NOT NULL DEFAULT 'PENDIENTE';

-- AlterTable
ALTER TABLE "public"."Usuario" DROP COLUMN "contraseña",
ADD COLUMN     "contrasena" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."Movimientos_inventario";

-- DropTable
DROP TABLE "public"."Pedido_por_orden";

-- DropEnum
DROP TYPE "public"."Estado_mesa";

-- DropEnum
DROP TYPE "public"."Estado_orden";

-- DropEnum
DROP TYPE "public"."Tipo_inventario_movimiento";

-- CreateTable
CREATE TABLE "public"."MovimientosInventario" (
    "id" TEXT NOT NULL,
    "tipo" "public"."TipoInventarioMovimiento" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "producto_id" TEXT NOT NULL,

    CONSTRAINT "MovimientosInventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PedidoPorOrden" (
    "id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "producto_id" TEXT NOT NULL,
    "orden_id" TEXT NOT NULL,

    CONSTRAINT "PedidoPorOrden_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MovimientosInventario" ADD CONSTRAINT "MovimientosInventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PedidoPorOrden" ADD CONSTRAINT "PedidoPorOrden_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PedidoPorOrden" ADD CONSTRAINT "PedidoPorOrden_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "public"."Orden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
