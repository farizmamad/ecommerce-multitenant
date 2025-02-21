import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { ITenant } from '../common/interfaces/tenant.interface';
import { DatabaseService } from '../database/database.service';
import { TenantMigrationService } from '../prisma/tenant-migration.service';
import { TenantDto } from './dto/tenant.dto';

@Injectable()
export class TenantService {
  private readonly managementPrisma: PrismaClient;
  
  constructor(
    private configService: ConfigService,
    private databaseService: DatabaseService,
    private tenantMigrationService: TenantMigrationService,
  ) {
    // Connect to management database that stores tenant information
    this.managementPrisma = new PrismaClient({
      datasources: {
        db: {
          url: this.configService.get<string>('TENANT_DATABASE_URL'),
        },
      },
    });
  }

  async findById(id: string): Promise<ITenant | null> {
    const tenant = await this.managementPrisma.tenant.findUnique({
      where: { id },
    });

    if (!tenant) {
      return null;
    }

    return {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      databaseUrl: tenant.databaseUrl,
      schema: tenant.schema,
    };
  }

  async findBySubdomain(subdomain: string): Promise<ITenant> {
    const tenant = await this.managementPrisma.tenant.findUnique({
      where: { subdomain },
    });

    if (!tenant) {
      return null;
    }

    return {
      id: tenant.id,
      name: tenant.name,
      subdomain: tenant.subdomain,
      databaseUrl: tenant.databaseUrl,
      schema: tenant.schema,
    };
  }

  async findByQuery(query: { name: string, subdomain: string }): Promise<Pick<ITenant, 'id'>> {
    const tenant = await this.managementPrisma.tenant.findFirst({
      select: { id: true },
      where: { OR: [{ name: query.name }, {subdomain: query.subdomain }]},
    });

    if (!tenant) {
      return null;
    }

    return {
      id: tenant.id,
    };
  }

  async createTenant(tenantData: Omit<Omit<Omit<ITenant, 'id'>, 'schema'>, 'databaseUrl'>): Promise<TenantDto> {
    // Make sure no same tenant name exists
    const exists = await this.findByQuery(tenantData);
    if (exists) {
      throw new BadRequestException(`Cannot use tenant name: ${tenantData.name} or subdomain: ${tenantData.subdomain}`);
    }

    const { name, subdomain } = tenantData;
    const schema = name.toLowerCase().replace(/\s+/g, '_');
    const dbName = `tenant_${schema}`;

    // Create tenant database
    const databaseUrl = await this.databaseService.createDatabase(dbName);
    
    // Create tenant record in management database
    const tenant = await this.managementPrisma.tenant.create({
      data: {
        name,
        subdomain,
        databaseUrl: databaseUrl,
        schema: schema,
        isActive: true,
      },
    });

    // Initialize the tenant's database (create schema, tables, etc.)
    await this.tenantMigrationService.applyMigrations(tenant);
    
    return new TenantDto(tenant);
  }
}
