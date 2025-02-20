import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PROVIDER } from 'src/utils/providers.constant';
import { DataSource } from 'typeorm';

export const TenantConnectionProvider = {
  provide: PROVIDER.DATA_SOURCE,
  useFactory: async (request: Request) => {
    if (!request['tenant_id']) {
      throw new InternalServerErrorException('Make sure to use the TenantMiddleware');
    }
    const connectionName = `tenant_${request['tenant_id']}`;
    // const connectionManager = getConnectionManager();

    // // cache hit
    // if (connectionManager.has(connectionName)) {
    //   const conn = connectionManager.get(connectionName);
    //   return conn.isConnected ? conn : conn.connect();
    // }

    try {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: connectionName,
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    } catch (err) {
      console.error(err)
      throw new NotFoundException('Tenant ID is not found')
    }
  },
  inject: [REQUEST],
};