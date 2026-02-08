-- CreateTable
CREATE TABLE "public"."Notificaciones" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "link" TEXT,
    "fue_revisada" BOOLEAN NOT NULL DEFAULT false,
    "esta_activa" BOOLEAN NOT NULL DEFAULT true,
    "usuario_id" TEXT NOT NULL,

    CONSTRAINT "Notificaciones_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Notificaciones" ADD CONSTRAINT "Notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
