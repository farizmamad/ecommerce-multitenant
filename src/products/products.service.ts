import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { IPaginated } from '../common/interfaces/paginated.interface';
import { IProduct } from '../common/interfaces/product.interface';
import { ITenant } from '../common/interfaces/tenant.interface';
import { TenantPrismaClientService } from '../prisma/tenant-prisma-client.service';
import { getPaginationQuery, getPaginationResponse } from '../utils/pagination';
import { CreateProductDto } from './dto/create-product.dto';
import { FindAllProductDto } from './dto/find-all-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private tenantClient: TenantPrismaClientService) {}

  async create(createProductDto: CreateProductDto): Promise<Pick<Product, 'id'>> {
    const productDb = await this.tenantClient.product();
    const data = {
      name: createProductDto.name,
      price: createProductDto.price,
    };
    const result = await productDb.create({ data });
    return { id: result.id };
  }

  async findAll(query: FindAllProductDto): Promise<IPaginated<IProduct>> {
    const productDb = await this.tenantClient.product();
    const where = {
      ...(query.search && {
        name: { contains: query.search, mode: Prisma.QueryMode.insensitive },
      })
    }
    const count = await productDb.count({ where });
    
    const { limit, page } = query;
    const pagination = getPaginationQuery({ limit, page, count });
    
    const result = await productDb.findMany({
      select: { id: true, name: true, price: true },
      where,
      orderBy: { createdAt: 'desc' },
      take: pagination.limit,
      skip: pagination.skip
    });
    return {
      pagination: getPaginationResponse(pagination),
      data: result,
    };
  }

  async findOne(id: string): Promise<IProduct | null> {
    const productDb = await this.tenantClient.product();
    const result = await productDb.findUnique({
      select: { id: true, name: true, price: true },
      where: { id },
    });
    if (!result) throw new NotFoundException('Product is not found');
    return result;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<IProduct> {
    if (Object.keys(updateProductDto).length === 0) {
      throw new BadRequestException('No update received');
    }
    const productDb = await this.tenantClient.product();
    
    // check existence
    await this.findOne(id);
    
    const result = await productDb.update({
      select: { id: true, name: true, price: true },
      where: { id },
      data: {
        ...(updateProductDto.name && { name: updateProductDto.name }),
        ...(updateProductDto.price && { price: updateProductDto.price }),
      }
    });
    return result;
  }
  
  async remove(id: string) {
    const productDb = await this.tenantClient.product();
    const result = await productDb.delete({
      select: { id: true, name: true, price: true },
      where: { id },
    });
    return result;
  }
}
