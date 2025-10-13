import { Module } from '@nestjs/common';
import { MesasService } from './mesas.service';
import { MesasController } from './mesas.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MesasController],
  providers: [MesasService, PrismaService],
  imports: [AuthModule],
})
export class MesasModule {}
