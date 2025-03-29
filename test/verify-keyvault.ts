#!/usr/bin/env ts-node

import 'dotenv/config';
import { SecretClient } from '@azure/keyvault-secrets';
import { ClientSecretCredential } from '@azure/identity';
import chalk from 'chalk';

// Cargar variables de entorno
const {
  KEYVAULT_SERVICE_URL,
  AZURE_TENANT_ID,
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
} = process.env;

async function listarSecretos() {
  console.log(chalk.bold('\n🔐 Verificando conexión con Azure Key Vault...'));
  console.log(chalk.gray('----------------------------------------------'));

  if (!KEYVAULT_SERVICE_URL || !AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET) {
    console.error(chalk.red('❌ Faltan variables de entorno necesarias.'));
    return;
  }

  console.log(`🔗 Vault URL: ${KEYVAULT_SERVICE_URL}`);
  console.log(`👤 Tenant ID: ${AZURE_TENANT_ID}`);
  console.log(`🪪 Client ID: ${AZURE_CLIENT_ID}`);
  console.log(`🔑 Client Secret: [PROVIDED]`);

  const credential = new ClientSecretCredential(
      AZURE_TENANT_ID,
      AZURE_CLIENT_ID,
      AZURE_CLIENT_SECRET
  );

  const client = new SecretClient(KEYVAULT_SERVICE_URL, credential);

  console.log('\n📦 Listando secretos disponibles...');
  let secretos: string[] = [];
  for await (const secretProperties of client.listPropertiesOfSecrets()) {
    secretos.push(secretProperties.name);
  }

  console.log(`✅ Conexión exitosa: ${secretos.length} secreto(s) encontrados.`);
  secretos.forEach((s) => console.log(`  - ${s}`));

  // Opcional: recuperar los valores de cada secreto
  for (const secretName of secretos) {
    console.log(`\n🔍 Intentando acceder al secreto: ${secretName}`);
    const secret = await client.getSecret(secretName);
    console.log(`✅ Secreto "${secretName}" recuperado correctamente:`);
    console.log(`   🔑 Valor: ${secret.value}`);
  }

  console.log(chalk.gray('\n----------------------------------------------'));
  console.log(chalk.green('✅ Verificación de Key Vault finalizada con éxito.'));
}

listarSecretos().catch((err) => {
  console.error(chalk.red('❌ Error al acceder al Key Vault:'), err.message);
});
