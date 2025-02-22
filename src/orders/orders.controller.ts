import { Body, Controller, HttpCode, HttpStatus, Inject, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ECOMMERCE_SERVICE_TOKEN, MESSAGE_PATTERNS } from 'src/common/constants/microservices.constant';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { TenantGuard } from 'src/common/guards/tenant.guard';
import { UserRole } from 'src/users/enums/user-role.enum';
import { UsersService } from 'src/users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentQueryDto } from './dto/payment-query.dto';
import { OrdersService } from './orders.service';

@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ECOMMERCE_SERVICE_TOKEN) private msClient: ClientProxy, // microservice client
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  @UseGuards(RolesGuard, TenantGuard)
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userJwt = req['user'];
    const user = await this.usersService.findOne(userJwt.sub);
    const tenant = req['tenant'];
    const result = await this.ordersService.create(user, tenant, createOrderDto);
    
    // publish event Order successfully created
    this.msClient.emit<number>(MESSAGE_PATTERNS.ORDER_CREATED, result);

    return result;
  }

  @Public()
  @Post('pay')
  @UseGuards(TenantGuard)
  @HttpCode(HttpStatus.OK)
  async pay(@Request() req, @Query() paymentQueryDto: PaymentQueryDto) {
    await this.ordersService.pay(paymentQueryDto);
  }
}
