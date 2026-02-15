import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrdenDto, PedidoPorOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import {
  OrdenBarra,
  RespuestaObtenerOrdenes,
  RespuestaOrden,
} from 'src/interfaces/orden.interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Orden } from 'generated/prisma';
import { BarGateway } from 'src/bar/bar.gateway';
import { Socket } from 'socket.io';

@Injectable()
export class OrdenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly barGateway: BarGateway,
  ) {}

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
    let orden: Orden;
    let mensaje: string = '';
    // Promise.all()

    for (const producto of productos) {
      const stockProducto = productosInStock.find(
        (item) => item.id == producto.producto_id,
      );
      const stockReal = stockProducto?.inventario?.cantidad ?? 0;

      if (stockReal < producto.cantidad) {
        throw new BadRequestException(
          `El producto ${stockProducto?.nombre} no tiene inventario suficiente para surtir la orden`,
        );
      }
      const actualizarProducto = this.prismaService.inventario.update({
        data: {
          cantidad: {
            decrement: producto.cantidad,
          },
        },
        where: {
          producto_id: producto.producto_id,
        },
      });

      productosComprometidos.push(actualizarProducto);
    }
    const ordenExistente = await this.prismaService.orden.findFirst({
      where: {
        mesa_id,
        mesero_id,
        estado_orden: {
          in: ['PENDIENTE', 'PREPARADA'],
        },
      },
    });
    if (ordenExistente) {
      const pedidos = productos.map((producto) => ({
        ...producto,
        orden_id: ordenExistente.id,
      }));

      await this.prismaService.pedidoPorOrden.createMany({
        data: pedidos,
      });
      orden = await this.prismaService.orden.update({
        data: {
          estado_orden: 'PENDIENTE',
        },

        where: {
          id: ordenExistente.id,
          mesa_id,
          mesero_id,
          estado_orden: {
            in: ['PENDIENTE', 'PREPARADA'],
          },
        },
      });

      mensaje = 'productos agregadosa a la orden con exito!';
    } else {
      orden = await this.prismaService.orden.create({
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

      mensaje = 'Orden creada con exito!';
    }
    if (!orden) {
      throw new BadRequestException('No fue posible crear la orden');
    }

    const ventas_actualizadas = await Promise.all(productosComprometidos);

    return {
      mensaje,
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

    const orden_actualizada =
      await this.prismaService.orden.updateManyAndReturn({
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
          this.prismaService.pedidoPorOrden.updateMany({
            where: {
              producto_id: p.producto_id,
              orden_id: id,
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
      orden: orden_actualizada[0],
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
  async obtenerOrdenesPorMesero(id: string) {
    const ordenes = await this.prismaService.orden.findMany({
      where: {
        mesero_id: id,
        estado_orden: 'PREPARADA',
      },
      include: {
        mesa: {
          select: {
            nombre: true,
            id: true,
          },
        },
        pedidos: {
          select: {
            preparado: true,
            cantidad: true,
            entregado_a_mesa: true,
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

    return {
      mensaje: 'Ordenes encontradas',
      ordenes,
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
    // const productosActualizados: any = [];

    // for (const pedido of orden.pedidos) {
    //   const producto = this.prismaService.inventario.update({
    //     data: {
    //       cantidad: {
    //         decrement: pedido.cantidad,
    //       },
    //     },
    //     where: {
    //       producto_id: pedido.producto_id,
    //     },
    //   });

    //   productosActualizados.push(producto);
    // }

    // await Promise.all(productosActualizados);

    return {
      mensaje: 'El estado de la orden se actualizo con exito!',
      orden: actualizar_estado_orden,
    };
  }

  async ordenPreparada(socket: Socket, id: string) {
    const orden = await this.prismaService.orden.findUnique({
      where: {
        id: id,
      },
      include: {
        pedidos: {
          select: {
            producto: {
              select: {
                id: true,
                nombre: true,
              },
            },
            cantidad: true,
            comentarios: true,
            para_barra: true,
            preparado: true,
            id: true,
          },
        },
        mesa: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
    let ordenBarra: OrdenBarra;

    const wasOnlyForBarra = orden?.pedidos.every(
      (pedido) => pedido.para_barra == true,
    );
    if (wasOnlyForBarra) {
      ordenBarra = await this.prismaService.orden.update({
        data: {
          estado_orden: 'PREPARADA',
          pedidos: {
            updateMany: {
              data: {
                preparado: true,
              },
              where: {
                orden_id: id,
              },
            },
          },
        },
        where: {
          id,
        },
        include: {
          mesa: {
            select: {
              nombre: true,
              es_vip: true,
            },
          },
          mesero: {
            select: {
              nombre_usuario: true,
            },
          },
          pedidos: {
            select: {
              cantidad: true,
              comentarios: true,
              preparado: true,
              para_barra: true,
              producto: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },

            where: {
              para_barra: true,
            },
          },
        },
      });
    } else {
      ordenBarra = await this.prismaService.orden.update({
        data: {
          pedidos: {
            updateMany: {
              data: {
                preparado: true,
              },
              where: {
                orden_id: id,
                para_barra: true,
              },
            },
          },
        },
        where: {
          id: id,
        },

        include: {
          mesa: {
            select: {
              nombre: true,
              es_vip: true,
            },
          },
          mesero: {
            select: {
              nombre_usuario: true,
            },
          },
          pedidos: {
            select: {
              cantidad: true,
              comentarios: true,
              preparado: true,
              para_barra: true,
              producto: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },

            where: {
              para_barra: true,
            },
          },
        },
      });
    }

    // const notification = await this.prismaService.notificaciones.create({
    //   data: {
    //     titulo: `Orden Preparada (Barra)`,
    //     descripcion: `La orden de ${ordenBarra.mesa.nombre} ya esta lista, recoge en barra`,
    //     usuario_id: orden?.mesero_id!,
    //     link: `/orden/${orden?.id}`,
    //   },
    // });

    // this.barGateway.handleOrderReady(socket, notification);

    return {
      mensaje: 'Orden prearada con exito!',
      orden: ordenBarra,
    };
  }

  async ordenesParaBarra() {
    const ordenes = await this.prismaService.orden.findMany({
      where: {
        estado_orden: 'PENDIENTE',
        AND: [
          {
            pedidos: {
              some: {
                para_barra: true,
                preparado: false,
              },
            },
          },
        ],
      },
      include: {
        mesa: {
          select: {
            nombre: true,
            es_vip: true,
          },
        },
        mesero: {
          select: {
            nombre_usuario: true,
          },
        },
        pedidos: {
          select: {
            id: true,
            cantidad: true,
            comentarios: true,
            preparado: true,
            para_barra: true,
            producto: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },

          where: {
            para_barra: true,
            preparado: false,
          },
        },
      },
    });

    return {
      mensaje: 'Ordenes Pendientes',
      ordenes,
    };
  }
  async completarUnPedido(id: string) {
    const pedido = await this.prismaService.pedidoPorOrden.findUnique({
      where: {
        id,
      },
    });
    if (!pedido) {
      throw new NotFoundException('No se encontro el pedido');
    }

    const updatePedido = await this.prismaService.pedidoPorOrden.update({
      data: {
        preparado: true,
      },
      where: {
        id,
      },
    });

    return {
      mensaje: 'Pedido preparado con exito!',
      pedido: updatePedido,
    };
  }
}
