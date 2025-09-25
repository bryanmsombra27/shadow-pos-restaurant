import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const LoggedUser = createParamDecorator(
  (roles: string[], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as any;
    const role = user.role.name;
    if (!roles.includes(role)) {
      throw new UnauthorizedException('accesso denegado');
    }
    return user;
  },
);
