import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { ArgonService } from 'src/services/argon/argon.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, PrismaService, ArgonService],
})
export class UsuarioModule {}
