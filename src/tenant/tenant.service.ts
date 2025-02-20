import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PROVIDER } from 'src/utils/providers.constant';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant, PROVIDER.DATA_SOURCE)
    private tenantRepo: Repository<Tenant>,
  ) {}

  async getTenantById(tenantId: string): Promise<Tenant> {
    return await this.tenantRepo.findOne({
      where: { id: tenantId },
    });
  }
}
