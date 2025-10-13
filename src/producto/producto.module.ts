import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductoController],
  providers: [ProductoService, PrismaService],
  imports: [AuthModule],
})
export class ProductoModule {}
