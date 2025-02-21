import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  productId: string;
}