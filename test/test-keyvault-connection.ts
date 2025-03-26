import { config } from 'dotenv';
import { ClientSecretCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

// Load environment variables
config();

const {
  KEYVAULT_SERVICE_URL,
  AZURE_TENANT_ID,
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
} = process.env;

async function testKeyVaultConnection() {
  console.log('Starting KeyVault connection test...');
  console.log('---------------------------------------');

  // Validate environment variables
  if (
    !KEYVAULT_SERVICE_URL ||
    !AZURE_TENANT_ID ||
    !AZURE_CLIENT_ID ||
    !AZURE_CLIENT_SECRET
  ) {
    console.error('Error: Missing required environment variables.');
    console.log(
      'Please make sure the following variables are set in your .env file:',
    );
    console.log('  - KEYVAULT_SERVICE_URL');
    console.log('  - AZURE_TENANT_ID');
    console.log('  - AZURE_CLIENT_ID');
    console.log('  - AZURE_CLIENT_SECRET');
    return false;
  }

  try {
    // Log configuration (without exposing secrets)
    console.log(`Vault URL: ${KEYVAULT_SERVICE_URL}`);
    console.log(`Tenant ID: ${AZURE_TENANT_ID}`);
    console.log(`Client ID: ${AZURE_CLIENT_ID}`);
    console.log(
      `Client Secret: ${AZURE_CLIENT_SECRET ? '[PROVIDED]' : '[MISSING]'}`,
    );

    // Create credential
    console.log('\nCreating Azure credential...');
    const credential = new ClientSecretCredential(
      AZURE_TENANT_ID,
      AZURE_CLIENT_ID,
      AZURE_CLIENT_SECRET,
    );

    // Create client
    console.log('Creating SecretClient...');
    const client = new SecretClient(KEYVAULT_SERVICE_URL, credential);

    // Test connection by listing secrets
    console.log('\nTesting connection by listing available secrets...');
    const secretList: string[] = [];

    for await (const secretProperties of client.listPropertiesOfSecrets()) {
      secretList.push(secretProperties.name);
    }

    // Display results
    if (secretList.length > 0) {
      console.log('\n✅ Connection successful!');
      console.log(`Found ${secretList.length} secrets in the KeyVault.`);
      console.log('\nAvailable secrets:');
      secretList.forEach((secretName) => {
        console.log(`- ${secretName}`);
      });

      // Try to get a specific secret
      try {
        console.log(
          '\nTrying to access a specific secret (first one in the list)...',
        );
        const testSecretName = secretList[0];
        const testSecret = await client.getSecret(testSecretName);
        console.log(`✅ Successfully retrieved secret "${testSecretName}"`);
      } catch (secretError) {
        console.warn(
          `⚠️ Unable to retrieve the secret: ${secretError.message}`,
        );
      }

      return true;
    } else {
      console.log(
        '✅ Connection successful, but no secrets were found in the KeyVault.',
      );
      return true;
    }
  } catch (error) {
    console.error('❌ KeyVault connection failed:');
    console.error(`Error message: ${error.message}`);

    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }

    console.log('\nPossible solutions:');
    console.log('1. Check that your Azure credentials are correct');
    console.log(
      '2. Verify that the service principal has permissions on the KeyVault',
    );
    console.log('3. Check for network restrictions on the KeyVault');
    console.log('4. Make sure your Tenant ID is complete and correct');

    return false;
  }
}

// Run the test
testKeyVaultConnection()
  .then((success) => {
    console.log('\n---------------------------------------');
    if (success) {
      console.log('✅ KeyVault verification completed successfully.');
    } else {
      console.log('❌ KeyVault verification failed.');
    }
  })
  .catch((error) => {
    console.error('Unexpected error during test:', error);
  });
