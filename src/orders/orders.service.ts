import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { IOrder } from '../common/interfaces/order.interface';
import { ITenant } from '../common/interfaces/tenant.interface';
import { IUser } from '../common/interfaces/user.interface';
import { TenantPrismaClientService } from '../prisma/tenant-prisma-client.service';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentQueryDto } from './dto/payment-query.dto';
import { OrderPaymentStatus } from './enums/order-payment-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    private configService: ConfigService,
    private tenantClient: TenantPrismaClientService,
    private productService: ProductsService,
  ) {}

  async create(customer: IUser, tenant: ITenant, createOrderDto: CreateOrderDto): Promise<IOrder> {
    const { productId } = createOrderDto;
    const product = await this.productService.findOne(productId);
    
    const orderDb = await this.tenantClient.order();
    
    const orderId = randomUUID();
    const paymentToken = await bcrypt.hash(orderId, 10);
    
    const data = {
      id: orderId,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email ?? '',
      productId,
      productName: product.name,
      total: product.price,
      paymentStatus: OrderPaymentStatus.UNPAID,
      paymentUrl: `${this.configService.get('PAYMENT_HOST') ?? 'http://localhost:3000/orders/pay'}?orderId=${orderId}&token=${paymentToken}`,
      tenantId: tenant?.id,
    };
    return await orderDb.create({
      data,
      select: {
        id: true,
        customerId: true,
        customerEmail: true,
        customerName: true,
        productId: true,
        productName: true,
        total: true,
        paidAt: true,
        paymentUrl: true,
        tenantId: true,
      },
    });
  }

  async pay(query: PaymentQueryDto) {
    const { orderId, token } = query;

    const isMatch = await bcrypt.compare(orderId, token);
    if (!isMatch) throw new BadRequestException(`Invalid request`);
    
    const orderDb = await this.tenantClient.order();

    // check existence
    await this.findOne(orderId);

    await orderDb.update({
      where: { id: orderId },
      data: { paymentStatus: OrderPaymentStatus.PAID, paidAt: new Date() },
    });
  }
  
  async findOne(id: string) {
    const orderDb = await this.tenantClient.order();
    const result = await orderDb.findUnique({ where: { id }});
    if (!result) throw new NotFoundException('Order is not found');
    return result;
  }
}
