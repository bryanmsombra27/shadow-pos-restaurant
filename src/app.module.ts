import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MesasModule } from './mesas/mesas.module';
import { PrismaService } from './services/prisma/prisma.service';
import { CategoriaModule } from './categoria/categoria.module';
import { RolModule } from './rol/rol.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ArgonService } from './services/argon/argon.service';
@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),

    AuthModule,

    MesasModule,

    CategoriaModule,

    RolModule,

    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, ArgonService],
})
export class AppModule {}
