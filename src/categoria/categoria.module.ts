import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaController } from './categoria.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { CacheService } from 'src/common/services/cache/cache.service';

@Module({
  controllers: [CategoriaController],
  providers: [CategoriaService, PrismaService],
  imports: [AuthModule],
})
export class CategoriaModule {}
