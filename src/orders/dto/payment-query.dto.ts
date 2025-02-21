import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class PaymentQueryDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  token: string;
}