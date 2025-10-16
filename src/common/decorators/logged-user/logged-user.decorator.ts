import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuarioFinal } from 'src/interfaces/usuario.interface';

export const LoggedUser = createParamDecorator(
  (roles: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UsuarioFinal;
    const role = user.rol_id;
    if (!roles.includes(role)) {
      throw new UnauthorizedException('accesso denegado');
    }
    return user;
  },
);
