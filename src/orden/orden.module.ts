import { Module } from '@nestjs/common';
import { OrdenService } from './orden.service';
import { OrdenController } from './orden.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Module({
  controllers: [OrdenController],
  providers: [OrdenService, PrismaService],
})
export class OrdenModule {}
