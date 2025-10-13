import { Module } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolController } from './rol.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RolController],
  providers: [RolService, PrismaService],
  imports: [AuthModule],
})
export class RolModule {}
