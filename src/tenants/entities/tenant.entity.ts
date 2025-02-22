import { ApiProperty } from '@nestjs/swagger';

export class Tenant {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  subdomain: string;

  databaseUrl: string;
  schema: string;  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}