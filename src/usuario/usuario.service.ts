import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import {
  RespuestaObtenerUsuarios,
  RespuestaUsuario,
  UsuarioFinal,
} from 'src/interfaces/usuario.interface';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { ArgonService } from 'src/services/argon/argon.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { erroresDB } from 'src/common/utils/gestor_errores';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly argonService: ArgonService,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<RespuestaUsuario> {
    const { contrasena, nombre_completo, nombre_usuario, rol_id, telefono } =
      createUsuarioDto;
    try {
      const contrasena_encriptada =
        await this.argonService.hashPassword(contrasena);

      const { contrasena: hash, ...usuario } =
        await this.prismaService.usuario.create({
          data: {
            nombre_completo,
            nombre_usuario,
            telefono,
            rol_id,
            contrasena: contrasena_encriptada,
          },
        });

      if (!usuario) {
        throw new BadRequestException('No fue posible crear el usuario!');
      }

      return {
        mensaje: 'Usuario creado con exito!',
        usuario,
      };
    } catch (error) {
      console.log(error, 'ERROR DB');
      erroresDB(error, 'El usuario ya fue registrado');

      throw new BadRequestException('No fue posible crear el usuario');
    }
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<RespuestaObtenerUsuarios> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const offset = (+page - 1) * limit;

    const usuarios = await this.prismaService.usuario.findMany({
      where: {
        rol: {
          nombre: {
            not: 'root',
          },
        },
      },

      skip: offset,
      take: limit,
      select: {
        created_at: true,
        id: true,
        nombre_completo: true,
        nombre_usuario: true,
        telefono: true,
        rol: true,
        rol_id: true,
      },
    });

    const total = await this.prismaService.usuario.count({
      where: {
        rol: {
          nombre: {
            not: 'root',
          },
        },
      },
    });

    // ceil redondear hacia arriba
    const totalPages = Math.ceil(total / limit);

    return {
      mensaje: 'usuarios encontrados!',
      usuarios,
      pagina: page,
      total_paginas: totalPages,
    };
  }

  async findOne(id: string): Promise<UsuarioFinal> {
    const usuario = await this.prismaService.usuario.findFirst({
      where: {
        id,
      },
      select: {
        created_at: true,
        id: true,
        nombre_completo: true,
        nombre_usuario: true,
        telefono: true,
        rol: true,
        rol_id: true,
      },
    });
    if (!usuario) {
      throw new BadRequestException('El usuario no es valido');
    }

    return usuario;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<RespuestaUsuario> {
    const usuario = await this.findOne(id);
    const { nombre_completo, nombre_usuario, telefono, rol_id } =
      updateUsuarioDto;

    const usuario_actualizado = await this.prismaService.usuario.update({
      data: {
        nombre_completo: nombre_completo ?? usuario.nombre_completo,
        nombre_usuario: nombre_usuario ?? usuario.nombre_usuario,
        telefono: telefono ?? usuario.telefono,
        rol_id: rol_id ?? usuario.rol_id,
      },
      where: {
        id,
      },
    });

    return {
      mensaje: 'usuario actualizado con exito!',
      usuario: usuario_actualizado,
    };
  }

  async remove(id: string): Promise<RespuestaUsuario> {
    await this.findOne(id);

    const usuario = await this.prismaService.usuario.delete({
      where: {
        id,
      },
      select: {
        created_at: true,
        id: true,
        nombre_completo: true,
        nombre_usuario: true,
        telefono: true,
        rol: true,
        rol_id: true,
      },
    });

    return {
      mensaje: 'Usuario eliminado con exito!',
      usuario: usuario,
    };
  }
}
