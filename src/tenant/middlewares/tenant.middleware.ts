import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction } from 'express';
import { TenantService } from '../tenant.service';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private tenantService: TenantService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantId = req.headers.get('x-tenant-id')?.toString();
    if (!tenantId) {
      throw new BadRequestException('Must provide x-tenant-id in the header');
    }

    const tenant = await this.tenantService.getTenantById(tenantId);
    if (!tenant) {
      throw new NotFoundException('Unknown tenant');
    }

    req['tenant_id'] = tenantId;
    next();
  }
}