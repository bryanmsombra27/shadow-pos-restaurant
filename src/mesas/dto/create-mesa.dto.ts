import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMesaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
