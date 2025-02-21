import { Global, Module } from '@nestjs/common';
import { ConnectionCacheService } from './connection-cache.service';
import { PrismaClientFactoryService } from './prisma-client-factory.service';
import { TenantMigrationService } from './tenant-migration.service';
import { TenantPrismaClientService } from './tenant-prisma-client.service';

@Global()
@Module({
  providers: [ConnectionCacheService, TenantPrismaClientService, TenantMigrationService, PrismaClientFactoryService],
  exports: [TenantPrismaClientService, TenantMigrationService],
})
export class PrismaModule {}