import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { ITenant } from 'src/common/interfaces/tenant.interface';
import { PrismaClientFactoryService } from './prisma-client-factory.service';
import { ManagementPrismaClientService } from './management-prisma-client.service';

@Injectable()
export class TenantMigrationService {
  constructor(
    private managementClient: ManagementPrismaClientService,
    private prismaFactory: PrismaClientFactoryService
  ) {}
  
  async applyMigrationsToManagementDatabase(): Promise<void> {  
    const client = await this.managementClient.getClient();
      
    try {
      // Apply migrations
      const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations');
      const migrations = fs.readdirSync(migrationsPath).sort();
      
      // Track applied migrations
      await this.ensureMigrationsTable(client);
      const appliedMigrations = await this.getAppliedMigrations(client);
      
      for (const migration of migrations) {
        if (migration.startsWith('migration_lock')) continue;
        if (!appliedMigrations.includes(migration)) {
          await this.applyMigration(client, migration, migrationsPath);
          await this.recordMigration(client, migration);
        }
      }
    } finally {
      await client.$disconnect();
    }
  }
  
  async applyMigrations(tenant: ITenant): Promise<void> {
    const client = this.prismaFactory.createPrismaClient(tenant);
    
    try {
      // Apply migrations
      const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations');
      const migrations = fs.readdirSync(migrationsPath).sort();
      
      // Track applied migrations
      await this.ensureMigrationsTable(client);
      const appliedMigrations = await this.getAppliedMigrations(client);
      
      for (const migration of migrations) {
        if (migration.startsWith('migration_lock')) continue;
        if (!appliedMigrations.includes(migration)) {
          await this.applyMigration(client, migration, migrationsPath);
          await this.recordMigration(client, migration);
        }
      }
    } finally {
      await client.$disconnect();
    }
  }
  
  private async ensureMigrationsTable(client: PrismaClient): Promise<void> {
    await client.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        "id" SERIAL PRIMARY KEY,
        "migration_name" TEXT NOT NULL UNIQUE,
        "applied_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  
  private async getAppliedMigrations(client: PrismaClient): Promise<string[]> {
    const result = await client.$queryRawUnsafe<{migration_name: string}[]>(
      `SELECT migration_name FROM "_prisma_migrations" ORDER BY applied_at ASC;`
    );
    
    return result.map(row => row.migration_name);
  }
  
  private async applyMigration(
    client: PrismaClient, 
    migration: string, 
    migrationsPath: string
  ): Promise<void> {
    const migrationPath = path.join(migrationsPath, migration, 'migration.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    // Split the SQL into statements and execute each one
    const statements = sql.split(';').filter(s => s.trim().length > 0);
    
    for (const statement of statements) {
      await client.$executeRawUnsafe(statement);
    }
  }
  
  private async recordMigration(client: PrismaClient, migration: string): Promise<void> {
    await client.$executeRawUnsafe(
      `INSERT INTO "_prisma_migrations" ("migration_name") VALUES ($1);`,
      migration
    );
  }
}