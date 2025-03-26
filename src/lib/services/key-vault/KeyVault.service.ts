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
} from '@/lib/config/AppConfig';

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

      this.logger.log(`Initializing KeyVault client with URL: ${vaultUrl}`);

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
      this.logger.error('KeyVault URL is null, empty or undefined');
      throw new InternalServerErrorException(
        'KeyVault URL is null, empty or undefined.',
      );
    }
    return vaultUrl;
  }

  private async validateConnection(): Promise<void> {
    try {
      this.logger.log('Validating KeyVault connection...');
      // List secrets to validate connection without requiring a specific secret name
      const iterator = this.client.listPropertiesOfSecrets();
      const firstItem = await iterator.next();

      if (!firstItem.done) {
        this.logger.log('Successfully connected to Azure KeyVault');
      } else {
        this.logger.log('Connected to KeyVault but no secrets found');
      }
    } catch (error) {
      this.logger.error(
        `Failed to establish a connection with Azure Key Vault: ${error.message}`,
      );
      throw new InternalServerErrorException(
        `Failed to establish a connection with Azure Key Vault: ${error.message}`,
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

  async listSecrets(): Promise<string[]> {
    try {
      this.logger.debug('Listing all available secrets');
      const secrets: string[] = [];

      for await (const secretProperties of this.client.listPropertiesOfSecrets()) {
        secrets.push(secretProperties.name);
      }

      return secrets;
    } catch (error) {
      this.logger.error(`Error listing secrets: ${error.message}`);
      throw new InternalServerErrorException(
        `Error listing secrets: ${error.message}`,
      );
    }
  }
}
