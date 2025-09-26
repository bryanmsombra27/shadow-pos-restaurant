import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty({ message: 'nombre completo requerido' })
  nombre_completo: string;

  @IsString()
  @IsNotEmpty({ message: 'telefono requerido' })
  telefono: string;

  @IsString()
  @IsNotEmpty({ message: 'nombre de usuario requerido' })
  nombre_usuario: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe ser mayor a 6 letras' })
  contrasena: string;

  @IsString()
  @IsNotEmpty({ message: 'rol de usuario requerido' })
  rol_id: string;
}
