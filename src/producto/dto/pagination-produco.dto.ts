import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class PaginationProductoDto extends PaginationDto {
  @IsOptional()
  @IsString()
  category: string;
}
