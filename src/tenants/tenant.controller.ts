import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
  constructor(
    private tenantService: TenantService,
  ) {}

  @Public()
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

  @Post('apply-migrations-management')
  async applyMigrationsToManagementDatabase() {
    return this.tenantService.applyMigrationsToManagementDatabase();
  }

  @Post('apply-migrations')
  @UseGuards(TenantGuard)
  async applyMigrationsToTenant(@Request() req) {
    const tenantId = req['tenant']?.id;
    return this.tenantService.applyMigrationsToTenantDatabase(tenantId);
  }
}