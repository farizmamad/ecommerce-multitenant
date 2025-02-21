import { IsAlphanumeric, IsDefined, IsEnum, IsNotEmpty, IsOptional, IsString, IsStrongPassword, Length } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  username: string;

  @IsDefined()
  @IsString()
  @Length(6)
  @IsStrongPassword(undefined, { message: 'Password must containing uppercase letter, lowercase letter, number, and symbol' })
  @IsNotEmpty()
  password: string;

  @IsDefined()
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: 'Admin' | 'Customer';

  @IsOptional()
  @IsString()
  tenantId?: string;
}
