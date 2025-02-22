import { IProduct } from 'src/common/interfaces/product.interface';
import { ITenant } from 'src/common/interfaces/tenant.interface';

export class Product implements IProduct {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  tenantId?: string;
  tenant?: ITenant;
}
