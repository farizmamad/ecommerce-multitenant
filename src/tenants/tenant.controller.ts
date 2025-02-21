import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(
    private tenantService: TenantService,
  ) {}

  @Post()
  async createTenant(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.createTenant(createTenantDto);
  }

  @Get()
  @UseGuards(TenantGuard)
  async getOneTenant(@Request() req) {
    const tenantId = req['tenant']?.id;
    return this.tenantService.findById(tenantId);
  }

  @Post('apply-migrations')
  @UseGuards(TenantGuard)
  async applyMigrationsToTenant(@Request() req) {
    const tenantId = req['tenant']?.id;
    return this.tenantService.applyMigrationsToTenantDatabase(tenantId);
  }
}