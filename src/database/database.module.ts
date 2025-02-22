import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { DatabaseService } from './database.service';

@Global()
@Module({
imports: [ConfigModule, PrismaModule],
providers: [DatabaseService],
exports: [DatabaseService],
})
export class DatabaseModule {}