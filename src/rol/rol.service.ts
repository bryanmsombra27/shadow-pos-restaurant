import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import {
  RespuestaObtenerRoles,
  RespuestaRol,
} from 'src/interfaces/rol.interface';
import { Prisma, Rol } from 'generated/prisma';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class RolService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createRolDto: CreateRolDto): Promise<RespuestaRol> {
    const rol = await this.prismaService.rol.create({
      data: {
        nombre: createRolDto.nombre,
      },
    });

    if (!rol) {
      throw new BadRequestException('No fue posible crear el rol');
    }

    return {
      mensaje: 'Rol creado con exito',
      rol,
    };
  }

  async findAll(paginationDto: PaginationDto): Promise<RespuestaObtenerRoles> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;
    const baseWhere: Prisma.RolWhereInput = {
      nombre: {
        not: 'root',
      },
    };

    const rolFindManyArgs: Prisma.RolFindManyArgs = {
      where: baseWhere,
      take: limit,
      skip: offset,
    };

    const rolCountArgs: Prisma.RolCountArgs = {
      where: baseWhere,
    };

    if (paginationDto.search) {
      rolFindManyArgs.where = {
        AND: [
          baseWhere,
          {
            nombre: {
              contains: paginationDto.search,
            },
          },
        ],
      };

      rolCountArgs.where = rolFindManyArgs.where;
    }

    const roles = await this.prismaService.rol.findMany(rolFindManyArgs);
    const total = await this.prismaService.rol.count(rolCountArgs);

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(total / limit);

    return {
      mensaje: 'Roles encontrados',
      roles,
      pagina: page,
      total_paginas: totalPages,
      total_registros: total,
    };
  }

  async findAllRegisters(): Promise<{ roles: Rol[] }> {
    const roles = await this.prismaService.rol.findMany({
      where: {
        nombre: {
          not: 'root',
        },
      },
    });

    return {
      roles,
    };
  }

  async findOne(id: string): Promise<Rol> {
    const rol = await this.prismaService.rol.findFirst({
      where: {
        id,
      },
    });
    if (!rol) {
      throw new NotFoundException('No se encontro rol');
    }

    return rol;
  }

  async update(id: string, updateRolDto: UpdateRolDto): Promise<RespuestaRol> {
    const rol = await this.findOne(id);

    const rol_actualizado = await this.prismaService.rol.update({
      data: {
        nombre: updateRolDto.nombre ?? rol.nombre,
      },
      where: {
        id,
      },
    });

    return {
      mensaje: 'Rol actualizado con exito!',
      rol: rol_actualizado,
    };
  }

  async remove(id: string): Promise<RespuestaRol> {
    await this.findOne(id);
    const rol = await this.prismaService.rol.delete({
      where: {
        id,
      },
    });

    return {
      mensaje: 'Rol eliminado con exito!',
      rol,
    };
  }
}
