import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { MailerModule } from './mailer/mailer.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { TenantMiddleware } from './tenants/middlewares/tenant.middleware';
import { TenantModule } from './tenants/tenant.module';
import { UsersModule } from './users/users.module';
import Keyv = require("keyv");

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    PrismaModule,
    DatabaseModule,
    TenantModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => {
        const keyvRedis = new KeyvRedis({
          url: `redis://${configService.getOrThrow('CACHE_HOST')?? 'localhost'}:${configService.getOrThrow('CACHE_PORT') ?? '6379'}`,
        });
        return {
          stores: [
            new Keyv(keyvRedis),
          ],
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes({ path: 'products', method: RequestMethod.ALL });
  }
}
