import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  usuario: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
