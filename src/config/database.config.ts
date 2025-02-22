import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  tenantUrl: process.env.TENANT_DATABASE_URL,
  defaultSchema: process.env.DEFAULT_SCHEMA || 'public',
}));