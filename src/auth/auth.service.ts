import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  generateToken(payload: any) {
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return token;
  }

  verifyToken(token: string) {
    const decodeToken = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });

    if (!decodeToken) throw new UnauthorizedException('Token invalido');

    return decodeToken;
  }
}
