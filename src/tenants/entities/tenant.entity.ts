export class Tenant {
  id: string;
  name: string;
  subdomain: string;
  databaseUrl: string;
  schema: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}