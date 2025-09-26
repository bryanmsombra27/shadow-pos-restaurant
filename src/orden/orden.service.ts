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

  create(createOrdenDto: CreateOrdenDto): Promise<RespuestaOrden> {
    return 'This action adds a new orden';
  }

  findAll(paginationDto: PaginationDto): Promise<RespuestaObtenerOrdenes> {
    return `This action returns all orden`;
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
    return `This action updates a #${id} orden`;
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
