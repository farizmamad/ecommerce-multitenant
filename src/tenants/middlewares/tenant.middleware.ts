import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, NextFunction } from 'express';
import { TenantService } from '../tenant.service';
import { ITenant } from 'src/common/interfaces/tenant.interface';

/**
 * Identify the Tenant from either the Request Header or Subdomain. 
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    let tenant: ITenant;
    let tenantId = req.headers['x-tenant-id']?.toString();
    if (!tenantId) {
      if (!req.headers.host) {
        throw new BadRequestException('Must provide x-tenant-id in the header or use tenant subdomain');
      }
      const subdomain = req.headers.host.split('.')[0];
      tenant = await this.tenantService.findBySubdomain(subdomain);
    } else {
      tenant = await this.tenantService.findById(tenantId);
    }

    if (!tenant) {
      throw new NotFoundException('Unknown tenant');
    }

    req['tenant'] = tenant;
    next();
  }
}