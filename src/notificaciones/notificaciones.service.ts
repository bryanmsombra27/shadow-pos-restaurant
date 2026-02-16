import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';
import { UpdateNotificacioneDto } from './dto/update-notificacione.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { Prisma } from 'generated/prisma';

@Injectable()
export class NotificacionesService {
  constructor(private readonly prismaService: PrismaService) {}

  create(createNotificacioneDto: CreateNotificacioneDto) {
    return 'This action adds a new notificacione';
  }

  async findAll() {
    const clause: Prisma.NotificacionesFindManyArgs = {
      where: {
        esta_activa: true,
        fue_revisada: false,
      },
    };

    const notifications =
      await this.prismaService.notificaciones.findMany(clause);
    const count = await this.prismaService.notificaciones.count({
      where: clause.where,
    });

    return {
      total: count,
      notifications,
    };
  }

  async obtenerNotificacionesPorUsuario(id: string) {
    const clause: Prisma.NotificacionesFindManyArgs = {
      where: {
        usuario_id: id,
        esta_activa: true,
        fue_revisada: false,
      },
    };

    const notifications =
      await this.prismaService.notificaciones.findMany(clause);
    const count = await this.prismaService.notificaciones.count({
      where: clause.where,
    });

    return {
      total: count,
      notifications,
    };
  }
  async notificacionVista(id: string) {
    const notificacion = await this.prismaService.notificaciones.findUnique({
      where: {
        id,
      },
    });
    if (!notificacion) {
      throw new NotFoundException('No se encontro la notificacion');
    }
    const notificationUpdated = await this.prismaService.notificaciones.update({
      data: {
        fue_revisada: true,
      },
      where: {
        id,
      },
    });

    return {
      mensaje: 'Notificacion revisada con exito',
      notificacion: notificationUpdated,
    };
  }

  update(id: number, updateNotificacioneDto: UpdateNotificacioneDto) {
    return `This action updates a #${id} notificacione`;
  }

  remove(id: number) {
    return `This action removes a #${id} notificacione`;
  }
}
