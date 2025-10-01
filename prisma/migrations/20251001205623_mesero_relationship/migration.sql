-- AlterEnum
ALTER TYPE "public"."EstadoMesa" ADD VALUE 'RESERVADO';

-- DropForeignKey
ALTER TABLE "public"."Mesa" DROP CONSTRAINT "Mesa_mesero_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Mesa" ADD CONSTRAINT "Mesa_mesero_id_fkey" FOREIGN KEY ("mesero_id") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE SET NULL;
