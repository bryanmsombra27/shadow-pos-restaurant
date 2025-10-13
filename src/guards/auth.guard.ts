import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CacheService } from 'src/common/services/cache/cache.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const token = this.getTokenFromHeader(request);

    if (!token || token.length == 0)
      throw new UnauthorizedException('el token es requerido');

    this.authService.verifyToken(token);

    const usuario = await this.cacheService.getFromCache(token);

    request['user'] = usuario;

    return true;
  }

  private getTokenFromHeader(request: Request) {
    const headers = request.headers as any;
    const token = headers.authorization
      ? headers.authorization?.split(' ')[1]
      : [];

    return token ?? undefined;
  }
}
