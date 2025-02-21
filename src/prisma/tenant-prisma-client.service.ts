import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { Tenant } from 'src/tenants/entities/tenant.entity';
import { ConnectionCacheService } from './connection-cache.service';

@Injectable({ scope: Scope.REQUEST })
export class TenantPrismaClientService {
  private prismaClient: PrismaClient;
  
  constructor(
    @Inject(REQUEST) private readonly request: { tenant: Tenant },
    private readonly connectionCache: ConnectionCacheService,
  ) {}
  
  // Lazy initialization of the client
  async getClient(): Promise<PrismaClient> {
    if (!this.prismaClient) {
      this.prismaClient = await this.connectionCache.getConnection(this.request.tenant);
    }
    return this.prismaClient;
  }
  
  // Put proxy methods to the actual Prisma client here
  async product() {
    const client = await this.getClient();
    return client.product;
  }

  async order() {
    const client = await this.getClient();
    return client.order;
  }
  
  /**
   * 
   * @param callback 
   * @returns 
   */
  async $transaction(callback: (prisma: PrismaClient) => Promise<any>) {
    const client = await this.getClient();
    return client.$transaction(callback);
  }
}