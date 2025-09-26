import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
}
