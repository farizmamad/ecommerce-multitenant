import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from '../common/constants/microservices.constant';
import { IOrder } from '../common/interfaces/order.interface';
import { MailerService } from './mailer.service';

@Controller()
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @EventPattern(MESSAGE_PATTERNS.ORDER_CREATED)
  async handleUserCreated(data: IOrder) {
    console.log('Sending order created email');
    await this.mailerService.sendOrderCreatedEmail(data);
  }
}
