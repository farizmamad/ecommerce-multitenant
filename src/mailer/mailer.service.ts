import { MailerService as NestJSMailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { IOrder } from 'src/common/interfaces/order.interface';

@Injectable()
export class MailerService {
  constructor(private mailService: NestJSMailerService) {}

  async sendOrderCreatedEmail(data: IOrder) {
    const result: SentMessageInfo = await this.mailService.sendMail({
      from: 'E-commerce Order <no-reply@ecommerce.com>',
      to: data.customerEmail,
      subject: `Your New Order`,
      text: `Congratulations! We have received your order.\nID:
        ${data.id}\nProduct: ${data.productName}.\n\nPlease pay by sending HTTP POST request.
        url: ${data.paymentUrl}
        headers: \n"Content-Type:application/json"\n"X-TENANT-ID: ${data.tenantId}
      `,
    });

    if (!result['response']?.toLowercase()?.contains('ok')) {
      console.log(`Failed to send order created email to ${data.customerEmail}`);
    } else {
      console.log(`Successfully send order created email to ${data.customerEmail}`);
    }
  }
}
