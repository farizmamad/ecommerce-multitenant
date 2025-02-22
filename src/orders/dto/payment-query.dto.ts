import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class PaymentQueryDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  token: string;
}