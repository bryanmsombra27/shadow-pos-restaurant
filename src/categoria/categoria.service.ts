import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import {
  RespuestaCategoria,
  RespuestaObtenerCategorias,
} from 'src/interfaces/categoria.interface';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Categoria } from 'generated/prisma';

@Injectable()
export class CategoriaService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createCategoriaDto: CreateCategoriaDto,
  ): Promise<RespuestaCategoria> {
    const categoria = await this.prismaService.categoria.create({
      data: {
        nombre: createCategoriaDto.nombre,
      },
    });

    if (!categoria) {
      throw new BadRequestException('No fue posible crear la categoria');
    }

    return {
      mensaje: 'Categoria creada con exito!',
      categoria,
    };
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<RespuestaObtenerCategorias> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const offset = (+page - 1) * limit;

    const categorias = await this.prismaService.categoria.findMany({
      take: limit,
      skip: offset,
    });

    const total = await this.prismaService.categoria.count();

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(total / limit);

    return {
      categorias,
      mensaje: 'Categorias encontradas',
      pagina: page,
      total_paginas: totalPages,
      total_registros: total,
    };
  }

  async todasLasCategorias() {
    const categorias = await this.prismaService.categoria.findMany();

    return {
      categorias,
    };
  }

  async findOne(id: string): Promise<Categoria> {
    const categoria = await this.prismaService.categoria.findFirst({
      where: {
        id,
      },
    });

    if (!categoria) {
      throw new NotFoundException('No se encontro la categoria');
    }

    return categoria;
  }

  async update(
    id: string,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<RespuestaCategoria> {
    const categoria = await this.findOne(id);

    const categoria_actualizada = await this.prismaService.categoria.update({
      data: {
        nombre: updateCategoriaDto.nombre ?? categoria.nombre,
      },
      where: {
        id,
      },
    });

    return {
      mensaje: 'Categoria actualiza con exito!',
      categoria: categoria_actualizada,
    };
  }

  async remove(id: string): Promise<RespuestaCategoria> {
    await this.findOne(id);
    const categoria = await this.prismaService.categoria.delete({
      where: {
        id,
      },
    });

    return {
      mensaje: 'Categoria eliminada con exito!',
      categoria,
    };
  }
}
