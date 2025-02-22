import { ITenant } from 'src/common/interfaces/tenant.interface';

export class User {
  id: string;
  name: string;
  email: string;
  password?: string;
  salt?: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  tenantId?: string;
  tenant?: ITenant;
}
