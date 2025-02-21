import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { TenantService } from '../../tenants/tenant.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly tenantService: TenantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'];

    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }

    const tenant = await this.tenantService.findById(tenantId);
    
    if (!tenant) {
      throw new UnauthorizedException('Invalid tenant');
    }

    request.tenant = tenant;
    return true;
  }
}