import { IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { ITenant } from 'src/common/interfaces/tenant.interface';

export class CreateTenantDto implements Omit<Omit<Omit<ITenant, 'id'>, 'databaseUrl'>, 'schema'> {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  subdomain: string;
}