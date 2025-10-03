import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import {
  RespuestaObtenerOrdenes,
  RespuestaOrden,
} from 'src/interfaces/orden.interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Orden } from 'generated/prisma';

@Injectable()
export class OrdenService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createOrdenDto: CreateOrdenDto): Promise<RespuestaOrden> {
    const { productos, mesa_id, mesero_id } = createOrdenDto;

    const productosIds = productos.map((producto) => producto.producto_id);

    const productosInStock = await this.prismaService.producto.findMany({
      where: {
        id: {
          in: productosIds,
        },
      },
      include: {
        inventario: true,
      },
    });
    const productosComprometidos: any = [];

    // Promise.all()

    for (const producto of productos) {
      const stockProducto = productosInStock.find(
        (item) => item.id == producto.producto_id,
      );
      const stockReal =
        (stockProducto?.inventario?.cantidad ?? 0) -
        (stockProducto?.inventario?.en_venta ?? 0);

      if (stockReal < producto.cantidad) {
        throw new BadRequestException(
          `El producto ${stockProducto?.nombre} no tiene inventario suficiente para surtir la orden`,
        );
      }
      const actualizarProducto = this.prismaService.inventario.update({
        data: {
          en_venta: {
            increment: producto.cantidad,
          },
        },
        where: {
          producto_id: producto.producto_id,
        },
      });

      productosComprometidos.push(actualizarProducto);
    }

    const orden = await this.prismaService.orden.create({
      data: {
        mesa_id,
        mesero_id,

        pedidos: {
          createMany: {
            data: productos,
          },
        },
      },
    });
    const ventas_actualizadas = await Promise.all(productosComprometidos);

    if (!orden) {
      throw new BadRequestException('No fue posible crear la orden');
    }

    return {
      mensaje: 'Orden creada con exito!',
      orden,
    };
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<RespuestaObtenerOrdenes> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;

    const ordenes = await this.prismaService.orden.findMany({
      where: {},
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.orden.count();

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(total / limit);

    return {
      mensaje: 'Ordenes encontradas',
      ordenes,
      pagina: page,
      total_paginas: totalPages,
      total_registros: total,
    };
  }

  async findOne(id: string): Promise<
    Orden & {
      pedidos: {
        id: string;
        precio: number;
        producto_id: string;
        cantidad: number;
        orden_id: string;
      }[];
    }
  > {
    const orden = await this.prismaService.orden.findFirst({
      where: {
        id,
      },
      include: {
        pedidos: true,
      },
    });

    if (!orden) {
      throw new BadRequestException('No se encontro la orden');
    }

    return orden;
  }

  async update(
    id: string,
    updateOrdenDto: UpdateOrdenDto,
  ): Promise<RespuestaOrden> {
    const orden = await this.findOne(id);

    const { mesa_id, mesero_id, productos } = updateOrdenDto;

    const orden_actualizada = await this.prismaService.orden.update({
      data: {
        mesero_id: mesero_id ?? orden.mesero_id,
        mesa_id: mesa_id ?? orden.mesa_id,
      },
      where: {
        id,
      },
    });
    if (productos!.length > 0) {
      await this.prismaService.$transaction(
        productos!.map((p) =>
          this.prismaService.pedidoPorOrden.update({
            where: {
              producto_orden: {
                orden_id: orden.id,
                producto_id: p.producto_id,
              },
            }, // identificador único del pedido
            data: {
              cantidad: p.cantidad,
            },
          }),
        ),
      );
    }

    return {
      mensaje: 'Orden actualizada con exito',
      orden: orden_actualizada,
    };
  }

  async remove(id: string): Promise<RespuestaOrden> {
    await this.findOne(id);

    const orden = await this.prismaService.orden.delete({
      where: {
        id,
      },
    });

    return {
      mensaje: 'Orden eliminada con exito!',
      orden,
    };
  }

  async obtenerOrdenPorMesa(id: string) {
    const orden = await this.prismaService.orden.findFirst({
      where: {
        mesa_id: id,
        estado_orden: 'PENDIENTE',
      },
      include: {
        mesero: {
          select: {
            nombre_completo: true,
          },
        },
        pedidos: {
          select: {
            cantidad: true,
            precio: true,
            producto: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });

    if (!orden) throw new NotFoundException('No se encontro orden');

    return {
      mensaje: 'Orden encontrada',
      orden,
    };
  }

  async completarOrden(id: string) {
    const orden = await this.findOne(id);

    const total = orden.pedidos.reduce(
      (acc, pedido) => acc + pedido.cantidad * pedido.precio,
      0,
    );

    const actualizar_estado_orden = await this.prismaService.orden.update({
      data: {
        total,
        estado_orden: 'PAGADA',
        mesa: {
          update: {
            estado_actual: 'DISPONIBLE',
            mesero_id: null,
          },
        },
      },
      where: {
        id: id,
      },
    });
    const productosActualizados: any = [];

    for (const pedido of orden.pedidos) {
      const producto = this.prismaService.inventario.update({
        data: {
          cantidad: {
            decrement: pedido.cantidad,
          },
          en_venta: {
            decrement: pedido.cantidad,
          },
        },
        where: {
          producto_id: pedido.producto_id,
        },
      });

      productosActualizados.push(producto);
    }

    await Promise.all(productosActualizados);

    return {
      mensaje: 'El estado de la orden se actualizo con exito!',
      orden: actualizar_estado_orden,
    };
  }
}
