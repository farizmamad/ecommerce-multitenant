import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { TenantConnectionProvider } from './providers/tenant-connection.provider';
import { TenantService } from './tenant.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tenant])],
  providers: [TenantService, TenantConnectionProvider],
  exports: [TenantConnectionProvider],
})
export class TenantModule {}
