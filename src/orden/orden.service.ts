import { BadRequestException, Injectable } from '@nestjs/common';
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

  async findOne(id: string): Promise<Orden> {
    const orden = await this.prismaService.orden.findFirst({
      where: {
        id,
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
}
