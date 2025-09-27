/*
  Warnings:

  - A unique constraint covering the columns `[producto_id,orden_id]` on the table `PedidoPorOrden` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PedidoPorOrden_producto_id_orden_id_key" ON "public"."PedidoPorOrden"("producto_id", "orden_id");
