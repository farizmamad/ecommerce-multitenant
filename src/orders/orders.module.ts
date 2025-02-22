import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ECOMMERCE_SERVICE_TOKEN } from 'src/common/constants/microservices.constant';
import { ProductsModule } from '../products/products.module';
import { TenantModule } from '../tenants/tenant.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ECOMMERCE_SERVICE_TOKEN,
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    TenantModule,
    UsersModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
