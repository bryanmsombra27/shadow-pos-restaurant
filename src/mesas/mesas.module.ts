import { Module } from '@nestjs/common';
import { MesasService } from './mesas.service';
import { MesasController } from './mesas.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { BarGateway } from 'src/bar/bar.gateway';

@Module({
  controllers: [MesasController],
  providers: [MesasService, PrismaService, BarGateway],
  imports: [AuthModule],
})
export class MesasModule {}
