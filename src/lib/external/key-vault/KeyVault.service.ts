import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClientSecretCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import {
  KEYVAULT_SERVICE_URL,
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
  AZURE_TENANT_ID,
} from '../../config/AppConfig';

@Injectable()
export class KeyVaultService {
  private client: SecretClient;
  private readonly logger = new Logger(KeyVaultService.name);

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    try {
      const vaultUrl = this.validateVaultUrl(KEYVAULT_SERVICE_URL);
      const tenantId = AZURE_TENANT_ID;
      const clientId = AZURE_CLIENT_ID;
      const clientSecret = AZURE_CLIENT_SECRET;

      this.logger.log('Initializing KeyVault client connection');

      const credential = new ClientSecretCredential(
        tenantId,
        clientId,
        clientSecret,
      );
      this.client = new SecretClient(vaultUrl, credential);
      this.validateConnection();
    } catch (error) {
      this.logger.error(`Error initializing KeyVault client: ${error.message}`);
      throw new InternalServerErrorException(
        `Error initializing KeyVault client: ${error.message}`,
      );
    }
  }

  private validateVaultUrl(vaultUrl: string): string {
    if (!vaultUrl) {
      throw new InternalServerErrorException(
        'KeyVault URL is null, empty or undefined.',
      );
    }
    return vaultUrl;
  }

  private async validateConnection(): Promise<void> {
    try {
      // Verifica la conexión consultando un secreto conocido
      await this.client.getSecret('DB-NAME');
      this.logger.log('KeyVault connection established successfully');
    } catch (error) {
      this.logger.error(
        'Failed to establish connection with Azure Key Vault',
        error,
      );
      throw new InternalServerErrorException(
        'Failed to establish a connection with Azure Key Vault.',
      );
    }
  }

  async getSecret(secretName: string): Promise<string> {
    try {
      this.logger.debug(`Retrieving secret: ${secretName}`);
      const secret = await this.client.getSecret(secretName);
      return secret.value!;
    } catch (error) {
      this.logger.error(
        `Error retrieving secret "${secretName}": ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Error retrieving secret "${secretName}": ${error.message}`,
      );
    }
  }
}
