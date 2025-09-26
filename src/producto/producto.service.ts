import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  RespuestaProducto,
  RespuestaObtenerProductos,
} from 'src/interfaces/producto.interface';
import { Prisma, Producto } from 'generated/prisma';

@Injectable()
export class ProductoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createProductoDto: CreateProductoDto,
    file: Express.Multer.File,
  ): Promise<RespuestaProducto> {
    const { categoria_id, descripcion, marca, nombre, cantidad_producto } =
      createProductoDto;
    const producto = await this.prismaService.producto.create({
      data: {
        nombre,
        categoria_id,
        descripcion,
        marca,
        imagen: file ? `/${file.filename}` : '/default-product.png',
        inventario: {
          create: {
            cantidad: cantidad_producto,
          },
        },
      },
    });

    if (!producto) {
      throw new BadRequestException('No fue posible crear el producto');
    }

    return {
      mensaje: 'Producto creado con Exito!',
      producto,
    };
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<RespuestaObtenerProductos> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;
    const whereClause: Prisma.ProductoWhereInput = {
      OR: [
        {
          nombre: {
            contains: paginationDto.search,
          },
        },
        {
          categoria: {
            nombre: {
              contains: paginationDto.search,
            },
          },
        },
        {
          marca: {
            contains: paginationDto.search,
          },
        },
        {
          descripcion: {
            contains: paginationDto.search,
          },
        },
      ],
    };

    if (paginationDto.search) {
    }

    const productos = await this.prismaService.producto.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
    });

    const total = await this.prismaService.producto.count({
      where: whereClause,
    });

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(total / limit);

    return {
      mensaje: 'Productos encontrados',
      pagina: page,
      productos,
      total_paginas: totalPages,
    };
  }

  async findOne(id: string): Promise<Producto> {
    const producto = await this.prismaService.producto.findFirst({
      where: {
        id,
      },
    });
    if (!producto) {
      throw new NotFoundException('El producto no fue encontrado');
    }

    return producto;
  }

  async update(
    id: string,
    updateProductoDto: UpdateProductoDto,
  ): Promise<RespuestaProducto> {
    const { categoria_id, descripcion, marca, nombre } = updateProductoDto;

    const producto = await this.findOne(id);

    const producto_actualizado = await this.prismaService.producto.update({
      data: {
        categoria_id: categoria_id ?? producto.categoria_id,
        descripcion: descripcion ?? producto.descripcion,
        nombre: nombre ?? producto.nombre,
        marca: marca ?? producto.marca,
      },
      where: {
        id,
      },
    });

    return {
      mensaje: 'producto actualizado con exito!',
      producto: producto_actualizado,
    };
  }

  async remove(id: string): Promise<RespuestaProducto> {
    await this.findOne(id);

    const producto = await this.prismaService.producto.delete({
      where: {
        id,
      },
    });

    return {
      mensaje: 'Producto eliminado con exito!',
      producto,
    };
  }
}
