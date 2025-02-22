import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Product ID provided by the Tenant'
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  productId: string;
}