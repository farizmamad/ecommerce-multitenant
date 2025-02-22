import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_TTL } from '../common/constants/cache.constants';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateProductDto } from './dto/create-product.dto';
import { FindAllProductDto } from './dto/find-all-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(RolesGuard, TenantGuard)
export class ProductsController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly productsService: ProductsService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Request() req, @Body() createProductDto: CreateProductDto) {
    const tenant = req['tenant'];
    return this.productsService.create(tenant, createProductDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  async findAll(@Request() req, @Query() query: FindAllProductDto) {
    const tenant = req['tenant'];

    const cacheKey = `${tenant.id}:findAllProducts:${JSON.stringify(query)}`;
    
    const cacheData = await this.cacheManager.get(cacheKey);  
    if (cacheData) return cacheData;

    const result = await this.productsService.findAll(query);
    
    await this.cacheManager.set(cacheKey, result, CACHE_TTL);

    return result;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CUSTOMER)
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(id);
  }
}
