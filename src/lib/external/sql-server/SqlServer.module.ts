// src/lib/external/azure/sql-server/SqlServer.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeyVaultService } from '../key-vault/KeyVault.service';
import {
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
  AZURE_TENANT_ID,
  DATABASE_SCHEMA,
} from '../../config/AppConfig';
import { KeyVaultModule } from '../key-vault/KeyVault.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [KeyVaultModule, ConfigModule],
      inject: [KeyVaultService, ConfigService],
      useFactory: async (
        keyVaultService: KeyVaultService,
        configService: ConfigService,
      ) => {
        const logger = new Logger('SqlServerModule');
        logger.log('Initializing SQL Server connection');

        // Función auxiliar para obtener secreto desde KeyVault o config
        const getSecretOrConfig = async (
          configKey: string,
          secretName: string,
        ) => {
          const configValue = configService.get<string>(configKey);
          if (configValue) {
            return configValue;
          }
          return await keyVaultService.getSecret(secretName);
        };

        // Obtener credenciales
        const sqlHost = await getSecretOrConfig('database.host', 'DB-HOST');
        const sqlDatabase = await getSecretOrConfig('database.name', 'DB-NAME');
        const schema =
          configService.get<string>('database.schema') || DATABASE_SCHEMA;

        logger.log(
          `Configuring connection to database ${sqlDatabase} on host ${sqlHost}`,
        );

        return {
          type: 'mssql',
          host: sqlHost,
          port: 1433,
          database: sqlDatabase,
          schema: schema,
          entities: [__dirname + '/../../../../**/*.entity{.ts,.js}'],
          synchronize: false, // No sincronizar en producción
          logging: configService.get<string>('NODE_ENV') !== 'production',
          options: {
            encrypt: true,
            enableArithAbort: true,
            trustServerCertificate: false,
          },
          authentication: {
            type: 'azure-active-directory-service-principal-secret',
            options: {
              tenantId: AZURE_TENANT_ID,
              clientId: AZURE_CLIENT_ID,
              clientSecret: AZURE_CLIENT_SECRET,
            },
          },
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class SqlServerModule {}
