import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { ITenant } from '../common/interfaces/tenant.interface';

@Injectable()
export class PrismaClientFactoryService {
  constructor(private configService: ConfigService) {}
  
  createPrismaClient(tenant: ITenant): PrismaClient {
    return new PrismaClient({
      datasources: {
        db: {
          url: tenant.databaseUrl,
        },
      },
      log: this.getLogLevel(),
    });
  }
  
  private getLogLevel() {
    const logLevel = this.configService.get<string>('PRISMA_LOG_LEVEL');
    
    if (!logLevel) {
      return undefined;
    }
    
    const levels = logLevel.split(',').map(level => level.trim());
    return levels as any[];
  }
}