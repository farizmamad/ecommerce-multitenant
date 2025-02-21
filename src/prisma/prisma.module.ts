import { Global, Module } from '@nestjs/common';
import { ConnectionCacheService } from './connection-cache.service';
import { PrismaClientFactoryService } from './prisma-client-factory.service';
import { TenantMigrationService } from './tenant-migration.service';
import { TenantPrismaClientService } from './tenant-prisma-client.service';
import { ManagementPrismaClientService } from './management-prisma-client.service';

@Global()
@Module({
  providers: [
    ConnectionCacheService,
    ManagementPrismaClientService,
    TenantPrismaClientService,
    TenantMigrationService,
    PrismaClientFactoryService,
  ],
  exports: [
    TenantPrismaClientService,
    TenantMigrationService,
    ManagementPrismaClientService,
  ],
})
export class PrismaModule {}