import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { IFindAll } from 'src/common/interfaces/find-all.interface';

export class FindAllProductDto implements IFindAll {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}