#!/usr/bin/env ts-node

import 'dotenv/config';
import chalk from 'chalk';
import { ClientSecretCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

// Load environment variables
const {
  KEYVAULT_SERVICE_URL,
  AZURE_TENANT_ID,
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
} = process.env;

async function verifyKeyVaultConnection() {
  console.log(chalk.bold('\n🔐 Verificando conexión con Azure Key Vault...'));
  console.log(chalk.gray('----------------------------------------------'));

  if (
    !KEYVAULT_SERVICE_URL ||
    !AZURE_TENANT_ID ||
    !AZURE_CLIENT_ID ||
    !AZURE_CLIENT_SECRET
  ) {
    console.error(chalk.red('\n❌ Variables de entorno faltantes:'));
    console.log(
      chalk.yellow(
        '\nAsegúrate de tener estas variables en tu archivo `.env`:\n',
      ),
    );
    console.log(`- KEYVAULT_SERVICE_URL`);
    console.log(`- AZURE_TENANT_ID`);
    console.log(`- AZURE_CLIENT_ID`);
    console.log(`- AZURE_CLIENT_SECRET\n`);
    process.exit(1);
  }

  try {
    console.log(`🔗 Vault URL: ${chalk.cyan(KEYVAULT_SERVICE_URL)}`);
    console.log(`👤 Tenant ID: ${chalk.cyan(AZURE_TENANT_ID)}`);
    console.log(`🪪 Client ID: ${chalk.cyan(AZURE_CLIENT_ID)}`);
    console.log(
      `🔑 Client Secret: ${AZURE_CLIENT_SECRET ? chalk.green('[PROVIDED]') : chalk.red('[MISSING]')}`,
    );

    const credential = new ClientSecretCredential(
      AZURE_TENANT_ID,
      AZURE_CLIENT_ID,
      AZURE_CLIENT_SECRET,
    );

    const client = new SecretClient(KEYVAULT_SERVICE_URL, credential);

    console.log('\n📦 Listando secretos disponibles...');

    const secretList: string[] = [];
    for await (const secret of client.listPropertiesOfSecrets()) {
      secretList.push(secret.name);
    }

    if (secretList.length === 0) {
      console.log(
        chalk.yellow('⚠️  Conexión exitosa, pero no se encontraron secretos.'),
      );
    } else {
      console.log(
        chalk.green(
          `✅ Conexión exitosa: ${secretList.length} secreto(s) encontrados.`,
        ),
      );
      secretList.forEach((name) => console.log(`  - ${chalk.blue(name)}`));
    }

    // Probar obtener uno
    const firstSecret = secretList[0];
    if (firstSecret) {
      try {
        console.log(
          `\n🔍 Intentando acceder al secreto: ${chalk.cyan(firstSecret)}`,
        );
        const retrieved = await client.getSecret(firstSecret);
        console.log(
          chalk.green(
            `✅ Secreto "${retrieved.name}" recuperado correctamente.`,
          ),
        );
      } catch (err) {
        console.log(
          chalk.yellow(`⚠️  No se pudo acceder al secreto: ${err.message}`),
        );
      }
    }

    console.log(chalk.gray('\n----------------------------------------------'));
    console.log(
      chalk.green('✅ Verificación de Key Vault finalizada con éxito.\n'),
    );
  } catch (error) {
    console.error(chalk.red('\n❌ Error durante la conexión con Key Vault:\n'));
    console.error(`🧾 ${error.message}`);
    if (error.code) {
      console.error(`🆔 Código: ${error.code}`);
    }
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Revisa tus credenciales de Azure');
    console.log('2. Verifica que tu identidad tenga permisos en el Key Vault');
    console.log('3. Asegúrate de que la red permita el acceso\n');
    process.exit(1);
  }
}

verifyKeyVaultConnection();
