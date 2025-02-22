import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [PrismaModule, DatabaseModule],
  controllers: [TenantController],
  providers: [
    TenantService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
  ],
  exports: [TenantService],
})
export class TenantModule {}
