import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EstadoMesa } from 'generated/prisma';

export class ActualizarEstadoMesaDto {
  @IsNotEmpty()
  @IsString()
  mesa_id: string;

  @IsNotEmpty()
  @IsString()
  mesero_id: string;

  @IsNotEmpty()
  @IsEnum(EstadoMesa)
  estado_mesa: EstadoMesa;
}
