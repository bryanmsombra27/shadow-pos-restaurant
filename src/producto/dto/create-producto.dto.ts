import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  marca: string;

  @IsNotEmpty()
  @IsString()
  categoria_id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cantidad_producto: number;
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  precio: number;
}
