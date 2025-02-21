import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { IFindAll } from 'src/common/interfaces/find-all.interface';

export class FindAllProductDto implements IFindAll {
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  page?: number;

  @IsOptional()
  @IsString()
  search?: string;
}