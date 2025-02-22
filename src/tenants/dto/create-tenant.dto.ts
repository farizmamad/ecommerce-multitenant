import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ITenant } from 'src/common/interfaces/tenant.interface';

export class CreateTenantDto implements Omit<Omit<Omit<ITenant, 'id'>, 'databaseUrl'>, 'schema'> {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  subdomain: string;
}