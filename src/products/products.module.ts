import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TenantModule } from '../tenants/tenant.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [TenantModule],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
