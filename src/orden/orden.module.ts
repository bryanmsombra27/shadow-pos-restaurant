import { Module } from '@nestjs/common';
import { OrdenService } from './orden.service';
import { OrdenController } from './orden.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { BarGateway } from 'src/bar/bar.gateway';

@Module({
  controllers: [OrdenController],
  providers: [OrdenService, PrismaService, BarGateway],
  imports: [AuthModule],
})
export class OrdenModule {}
