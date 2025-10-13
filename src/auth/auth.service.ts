import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  LoginUsuario,
  PayloadToken,
  UsuarioFinal,
} from 'src/interfaces/usuario.interface';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { ArgonService } from 'src/services/argon/argon.service';
import { Usuario } from 'generated/prisma';
import { CacheService } from 'src/common/services/cache/cache.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly argonService: ArgonService,
    private readonly cacheService: CacheService,
  ) {}
  generateToken(payload: PayloadToken) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  verifyToken(token: string) {
    try {
      const decodeToken = this.jwtService.verify(token);
      console.log(decodeToken, 'decode token');

      return decodeToken;
    } catch (error) {
      throw new UnauthorizedException('Token invalido');
    }
  }

  async login(loginDto: LoginDto): Promise<LoginUsuario> {
    const { usuario, password } = loginDto;
    const user = await this.prismaService.usuario.findUnique({
      where: {
        nombre_usuario: usuario,
      },
      include: {
        rol: true,
      },
    });
    if (!user) {
      throw new NotFoundException('El usuario es invalido o no existe');
    }

    const { contrasena, created_at, ...userLogin } = user;
    const isValidPassword = await this.argonService.comparePassword(
      password,
      contrasena,
    );

    if (!isValidPassword) {
      throw new BadRequestException(
        'El usuario o la contraseña no son validos',
      );
    }
    const token = this.generateToken({
      id: userLogin.id,
      nombre: userLogin.nombre_usuario,
      rol_id: userLogin.rol_id,
    });
    const wasCached = await this.cacheService.setToCache(token, userLogin);
    if (wasCached) {
      console.log('USUARIO CACHEADO CON EXITO');
      const user = await this.cacheService.getFromCache(token);

      console.log('USUARIO EN CACHE STORE', user);
    }

    return {
      mensaje: 'login exioso!',
      token,
    };
  }
}
