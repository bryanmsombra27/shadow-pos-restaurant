import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { ArgonService } from 'src/services/argon/argon.service';
import { CacheService } from 'src/common/services/cache/cache.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, ArgonService, CacheService],
  imports: [ConfigModule.forRoot()],
  exports: [AuthService, CacheService],
})
export class AuthModule {}
