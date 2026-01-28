import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateOrdenDto {
  @IsNotEmpty()
  @IsString()
  mesa_id: string;

  @IsNotEmpty()
  @IsString()
  mesero_id: string;

  @ArrayNotEmpty()
  @Type(() => PedidoPorOrdenDto)
  productos: PedidoPorOrdenDto[];
}

export class PedidoPorOrdenDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  cantidad: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  precio: number;

  @IsNotEmpty()
  @IsString()
  producto_id: string;

  @IsString()
  @IsOptional()
  comentarios?: string;

  @IsBoolean()
  @IsOptional()
  para_barra?: boolean;
}
