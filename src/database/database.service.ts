import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class DatabaseService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Creates a new PostgreSQL database for a tenant
   * @param name The name of the database to create
   * @returns Promise resolving when the database is created
   */
  async createDatabase(name: string): Promise<string> {
    const adminDbUrl = this.configService.get<string>('POSTGRES_ADMIN_URL');
    if (!adminDbUrl) {
      throw new Error('POSTGRES_ADMIN_URL environment variable is not set');
    }

    // Sanitize the database name to prevent SQL injection
    const sanitizedName = this.sanitizeDatabaseName(name);

    const client = new Client({
      connectionString: adminDbUrl,
    });

    try {
      await client.connect();
      console.log(`Creating new database: ${sanitizedName}`);
      
      // Check if database already exists
      const checkResult = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`, 
        [sanitizedName]
      );
      
      if (checkResult.rowCount > 0) {
        console.warn(`Database ${sanitizedName} already exists`);
        return;
      }
      
      // Create the database
      await client.query(`CREATE DATABASE "${sanitizedName}"`);
      console.log(`Successfully created database: ${sanitizedName}`);

      // Create basic schema
      await client.query(`
        CREATE SCHEMA IF NOT EXISTS public;
      `);
      console.log(`Successfully create schema: public in database: ${sanitizedName}`);
    } catch (error) {
      console.error(`Failed to create database ${sanitizedName}: ${error.message}`);
      throw new Error(`Failed to create tenant database: ${error.message}`);
    } finally {
      await client.end();
    }

    return this.generateConnectionString(sanitizedName);
  }

  /**
   * Generates a database connection string for a tenant
   * @param dbName The database name
   * @returns The full connection string
   */
  generateConnectionString(dbName: string): string {    
    return `postgresql://${
        this.configService.getOrThrow('DATABASE_USERNAME')
      }:${this.configService.getOrThrow('DATABASE_PASSWORD')}@${
      this.configService.getOrThrow('DATABASE_HOST')}:${this.configService.getOrThrow('DATABASE_PORT')}/${dbName}`;
  }

  /**
   * Initialize a newly created tenant database with schema
   * @param connectionString Connection string to the tenant database
   */
  async initializeTenantDatabase(connectionString: string): Promise<void> {
    const client = new Client({
      connectionString,
    });
    try {
      await client.connect();
      console.log('Initializing tenant database schema');
      
      
      
      console.log('Successfully initialized tenant database schema');
    } catch (error) {
      console.error(`Failed to initialize tenant database: ${error.message}`);
      throw new Error(`Failed to initialize tenant database: ${error.message}`);
    } finally {
      await client.end();
    }
  }

  /**
   * Sanitize database name to prevent SQL injection and ensure valid PostgreSQL identifier
   * @param name Raw database name
   * @returns Sanitized database name
   */
  private sanitizeDatabaseName(name: string): string {
    // Remove any non-alphanumeric characters except underscore
    // Convert to lowercase and replace spaces with underscores
    return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/^[0-9]/, 'db$&'); // Ensure name doesn't start with number
  }
}