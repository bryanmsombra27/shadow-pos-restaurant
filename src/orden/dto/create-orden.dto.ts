import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
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
  @Type(() => PedidoPorOrden)
  productos: PedidoPorOrden[];
}

class PedidoPorOrden {
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
}
