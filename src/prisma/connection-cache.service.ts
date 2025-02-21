import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ITenant } from 'src/common/interfaces/tenant.interface';
import { PrismaClientFactoryService } from './prisma-client-factory.service';

interface CachedConnection {
  client: PrismaClient;
  lastUsed: number;
}

@Injectable()
export class ConnectionCacheService implements OnModuleInit, OnModuleDestroy {
  private connections: Map<string, CachedConnection> = new Map();
  private readonly TTL = 15 * 60 * 1000; // 15 minutes TTL
  private cleanupInterval: NodeJS.Timeout;

  constructor(private prismaFactory: PrismaClientFactoryService) {}

  onModuleInit() {
    // Periodic cleanup of idle connections
    this.cleanupInterval = setInterval(() => this.cleanupIdleConnections(), 5 * 60 * 1000);
  }

  async getConnection(tenant: ITenant): Promise<PrismaClient> {
    if (this.connections.has(tenant.id)) {
      const cached = this.connections.get(tenant.id);
      cached.lastUsed = Date.now();
      return cached.client;
    }

    const client = this.prismaFactory.createPrismaClient(tenant);
    
    await client.$connect();
    
    this.connections.set(tenant.id, {
      client,
      lastUsed: Date.now(),
    });
    
    return client;
  }

  private async cleanupIdleConnections() {
    const now = Date.now();
    
    for (const [tenantId, connection] of this.connections.entries()) {
      if (now - connection.lastUsed > this.TTL) {
        await connection.client.$disconnect();
        this.connections.delete(tenantId);
      }
    }
  }

  async onModuleDestroy() {
    clearInterval(this.cleanupInterval);
    
    for (const connection of this.connections.values()) {
      await connection.client.$disconnect();
    }
    
    this.connections.clear();
  }
}