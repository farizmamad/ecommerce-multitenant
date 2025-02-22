
import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUser } from '../common/interfaces/user.interface';
import { ManagementPrismaClientService } from '../prisma/management-prisma-client.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private managementClient: ManagementPrismaClientService) {}

  async findOneWithSecret(email: string): Promise<User | undefined> {
    const userDb = await this.managementClient.user();
    return await userDb.findUnique({
      where: { email },
    });
  }

  async findOne(id: string): Promise<IUser | undefined> {
    const userDb = await this.managementClient.user();
    return await userDb.findUnique({
      select: { id: true, name: true, role: true, email: true, tenant: true, tenantId: true },
      where: { id },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<Pick<User, 'id'> | undefined> {
    if (createUserDto.role === 'Admin' && !createUserDto.tenantId) {
      throw new BadRequestException('Admin user must be assigned to a Tenant');
    }

    const userDb = await this.managementClient.user();

    // make sure not a duplicate
    const exists = await userDb.findFirst({ where: { email: createUserDto.email }});
    if (exists) throw new BadRequestException(`Cannot use email: ${createUserDto.email}`);

    // make sure tenant exists
    if (createUserDto.tenantId) {
      const tenantDb = await this.managementClient.tenant();
      const tenant = await tenantDb.findFirst({ select: { id: true}, where: { id: createUserDto.tenantId }});
      if (!tenant) throw new BadRequestException(`Unknown tenant`);
    }

    const user = {
      name: createUserDto.name,
      email: createUserDto.email,
      salt: bcrypt.genSaltSync(12),
      password: createUserDto.password,
      role: createUserDto.role,
      tenantId: createUserDto.tenantId,
    };

    user.password = await bcrypt.hash(createUserDto.password, user.salt);

    const result = await userDb.create({ data: user });
    return { id: result.id };
  }
}
