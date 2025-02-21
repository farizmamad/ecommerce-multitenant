import { ITenant } from './tenant.interface';

export interface IUser {
  id: string;
  name: string;
  username: string;
  role?: string;
  tenantId?: string;
  tenant?: ITenant;
}