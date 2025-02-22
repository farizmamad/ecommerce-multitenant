import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ManagementPrismaClientService {
  constructor(private configService: ConfigService) {}

  async getClient() {
    return new PrismaClient({
      datasources: {
        db: {
          url: this.configService.getOrThrow<string>('TENANT_DATABASE_URL'),
        },
      },
    });
  }

  async tenant() {
    return (await this.getClient())?.tenant;
  }

  async user() {
    return (await this.getClient())?.user;
  }
}