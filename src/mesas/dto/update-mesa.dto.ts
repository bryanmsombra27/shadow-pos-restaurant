import { PartialType } from '@nestjs/mapped-types';
import { CreateMesaDto } from './create-mesa.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoMesa, type Orden } from 'generated/prisma';

export class UpdateMesaDto extends PartialType(CreateMesaDto) {
  @IsOptional()
  @IsString()
  mesero_id: string;

  @IsOptional()
  es_vip: boolean;

  @IsOptional()
  @IsEnum(EstadoMesa)
  estado_actual: EstadoMesa;
}
