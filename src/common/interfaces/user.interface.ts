import { ITenant } from './tenant.interface';

export interface IUser {
  email?: string;
  id: string;
  name: string;
  username: string;
  role?: string;
  tenantId?: string;
  tenant?: ITenant;
}