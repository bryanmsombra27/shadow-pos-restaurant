import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  RespuestaMesa,
  RespuestaObtenerTodasLasMesas,
} from 'src/interfaces/mesa.interface';
import { Mesa } from 'generated/prisma';
import { ActualizarEstadoMesaDto } from './dto/actualizar-estado-mesa.dto';

@Injectable()
export class MesasService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMesaDto: CreateMesaDto): Promise<RespuestaMesa> {
    const mesa = await this.prismaService.mesa.create({
      data: {
        nombre: createMesaDto.nombre,
      },
    });

    if (!mesa) {
      throw new BadRequestException('No fue posible crear la mesa');
    }

    return {
      mensaje: 'Mesa creada con exito!',
      mesa,
    };
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<RespuestaObtenerTodasLasMesas> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;

    const mesas = await this.prismaService.mesa.findMany({
      include: {
        mesero: {
          select: {
            id: true,
            rol_id: true,
            nombre_completo: true,
          },
        },
      },
      take: limit,
      skip: offset,
    });
    const total = await this.prismaService.mesa.count();

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(total / limit);

    return {
      mensaje: 'Mesas encontradas',
      total_paginas: totalPages,
      pagina: page,
      total_registros: total,
      mesas,
    };
  }
  async todasLasMesas() {
    const mesas = await this.prismaService.mesa.findMany({
      include: {
        mesero: {
          select: {
            id: true,
            rol_id: true,
            nombre_completo: true,
          },
        },
      },
    });

    return {
      mesas,
    };
  }

  async findOne(id: string): Promise<Mesa> {
    const mesa = await this.prismaService.mesa.findFirst({
      where: {
        id,
      },
    });
    if (!mesa) {
      throw new NotFoundException('No se encontro la mesa');
    }

    return mesa;
  }

  async update(
    id: string,
    updateMesaDto: UpdateMesaDto,
  ): Promise<RespuestaMesa> {
    const mesa = await this.findOne(id);
    const { es_vip, estado_actual, mesero_id, nombre } = updateMesaDto;

    const mesa_actualizada = await this.prismaService.mesa.update({
      data: {
        nombre: nombre ?? mesa.nombre,
        es_vip: es_vip ?? mesa.es_vip,
        estado_actual: estado_actual ?? mesa.estado_actual,
        mesero_id: mesero_id ?? mesa.mesero_id,
      },
      include: {
        mesero: true,
      },

      where: {
        id,
      },
    });

    return {
      mensaje: 'Mesa actualizada con exito!',
      mesa: mesa_actualizada,
    };
  }

  async actualizarEstadoMesa(
    ActualizarEstadoMesaDto: ActualizarEstadoMesaDto,
  ): Promise<RespuestaMesa> {
    const { estado_mesa, mesa_id, mesero_id } = ActualizarEstadoMesaDto;

    const mesa = await this.prismaService.mesa.update({
      data: {
        mesero_id,
        estado_actual: estado_mesa,
      },
      include: {
        mesero: true,
      },

      where: {
        id: mesa_id,
      },
    });

    return {
      mensaje: 'Mesa tomada con exito!',
      mesa,
    };
  }
  async remove(id: string): Promise<RespuestaMesa> {
    await this.findOne(id);

    const mesa_eliminada = await this.prismaService.mesa.delete({
      where: {
        id,
      },
    });

    return {
      mensaje: 'Mesa Eliminada con exito',
      mesa: mesa_eliminada,
    };
  }
}
