import { MailerService as NestJSMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IOrder } from 'src/common/interfaces/order.interface';

@Injectable()
export class MailerService {
  constructor(private mailService: NestJSMailerService) {}

  async sendOrderCreatedEmail(data: IOrder) {
    await this.mailService.sendMail({
      from: 'E-commerce Order <no-reply@ecommerce.com>',
      to: data.customerEmail,
      subject: `Your New Order`,
      text: `Congratulations! We have received your order.\nID: ${data.id}\nProduct: ${data.productName}.\n\nPlease pay by clicking this link: ${data.paymentUrl}`,
    });
  }
}
