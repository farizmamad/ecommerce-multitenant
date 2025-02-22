import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extract tenant information attached to the incoming request
 */
export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenant;
  },
);