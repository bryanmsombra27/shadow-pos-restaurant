-- DropForeignKey
ALTER TABLE "public"."PedidoPorOrden" DROP CONSTRAINT "PedidoPorOrden_orden_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."PedidoPorOrden" ADD CONSTRAINT "PedidoPorOrden_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "public"."Orden"("id") ON DELETE CASCADE ON UPDATE CASCADE;
