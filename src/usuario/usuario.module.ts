import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { ArgonService } from 'src/services/argon/argon.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsuarioController],
  imports: [AuthModule],
  providers: [UsuarioService, PrismaService, ArgonService],
})
export class UsuarioModule {}
