import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Length } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'Customer 1',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'format: email',
    example: 'customer1@email.com',
  })
  @IsDefined()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password must containing uppercase letter, lowercase letter, number, and symbol',
    example: 'Abc123!'
  })
  @IsDefined()
  @IsString()
  @Length(6)
  @IsStrongPassword(undefined, { message: 'Password must containing uppercase letter, lowercase letter, number, and symbol' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ enum: ['Admin', 'Customer'] })
  @IsDefined()
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: 'Admin' | 'Customer';

  @ApiPropertyOptional({
    description: 'Tenant ID. Only applicable for role: Admin'
  })
  @IsOptional()
  @IsString()
  tenantId?: string;
}
