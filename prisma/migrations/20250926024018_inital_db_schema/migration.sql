-- CreateEnum
CREATE TYPE "public"."Estado_mesa" AS ENUM ('disponible', 'ocupado');

-- CreateEnum
CREATE TYPE "public"."Tipo_inventario_movimiento" AS ENUM ('Venta', 'Devolucion', 'Ingreso');

-- CreateEnum
CREATE TYPE "public"."Estado_orden" AS ENUM ('Pagada', 'Pendiente', 'Cancelada');

-- CreateTable
CREATE TABLE "public"."Rol" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "nombre_usuario" TEXT NOT NULL,
    "contraseña" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rol_id" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mesa" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "es_vip" BOOLEAN NOT NULL,
    "estado_actual" "public"."Estado_mesa" NOT NULL,
    "mesero_id" TEXT,

    CONSTRAINT "Mesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Categoria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Producto" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "descripcion" TEXT,
    "marca" TEXT,
    "categoria_id" TEXT NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Inventario" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "en_venta" INTEGER NOT NULL,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Movimientos_inventario" (
    "id" TEXT NOT NULL,
    "tipo" "public"."Tipo_inventario_movimiento" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "producto_id" TEXT NOT NULL,

    CONSTRAINT "Movimientos_inventario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pedido_por_orden" (
    "id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "producto_id" TEXT NOT NULL,
    "orden_id" TEXT NOT NULL,

    CONSTRAINT "Pedido_por_orden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Orden" (
    "id" TEXT NOT NULL,
    "mesero_id" TEXT NOT NULL,
    "mesa_id" TEXT NOT NULL,
    "estado_orden" "public"."Estado_orden" NOT NULL DEFAULT 'Pendiente',
    "total" DOUBLE PRECISION,

    CONSTRAINT "Orden_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nombre_usuario_key" ON "public"."Usuario"("nombre_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Inventario_producto_id_key" ON "public"."Inventario"("producto_id");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "public"."Rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Mesa" ADD CONSTRAINT "Mesa_mesero_id_fkey" FOREIGN KEY ("mesero_id") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Producto" ADD CONSTRAINT "Producto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "public"."Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Inventario" ADD CONSTRAINT "Inventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Movimientos_inventario" ADD CONSTRAINT "Movimientos_inventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido_por_orden" ADD CONSTRAINT "Pedido_por_orden_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "public"."Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pedido_por_orden" ADD CONSTRAINT "Pedido_por_orden_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "public"."Orden"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Orden" ADD CONSTRAINT "Orden_mesero_id_fkey" FOREIGN KEY ("mesero_id") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Orden" ADD CONSTRAINT "Orden_mesa_id_fkey" FOREIGN KEY ("mesa_id") REFERENCES "public"."Mesa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
