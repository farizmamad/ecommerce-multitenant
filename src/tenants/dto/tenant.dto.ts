import { OmitType } from '@nestjs/mapped-types';
import { Tenant } from '../entities/tenant.entity';

export class TenantDto extends OmitType(Tenant, ['databaseUrl', 'isActive', 'schema', 'createdAt', 'updatedAt']) {
  constructor(tenant: Tenant) {
    super();
    
    this.id = tenant.id;
    this.name = tenant.name;
    this.subdomain = tenant.subdomain;
  }
}