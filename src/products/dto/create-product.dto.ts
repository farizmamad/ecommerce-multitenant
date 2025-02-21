import { IsDefined, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsNumber()
  @IsNotEmpty()
  price: number;
}
