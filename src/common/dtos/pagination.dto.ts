import { Transform } from 'class-transformer';
import { IsOptional, IsString, Min } from 'class-validator';
export class PaginationDto {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search: string;
}
