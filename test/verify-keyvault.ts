#!/usr/bin/env ts-node

import 'dotenv/config';
import { SecretClient } from '@azure/keyvault-secrets';
import { ClientSecretCredential } from '@azure/identity';

// Cargar variables de entorno
const {
  KEYVAULT_SERVICE_URL,
  AZURE_TENANT_ID,
  AZURE_CLIENT_ID,
  AZURE_CLIENT_SECRET,
} = process.env;

async function listarSecretos() {
  console.log('\n🔐 Verificando conexión con Azure Key Vault...');
  console.log('----------------------------------------------');

  if (!KEYVAULT_SERVICE_URL || !AZURE_TENANT_ID || !AZURE_CLIENT_ID || !AZURE_CLIENT_SECRET) {
    console.error('❌ Faltan variables de entorno necesarias.');
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

  // Recuperar los valores de cada secreto (opcional)
  for (const secretName of secretos) {
    console.log(`\n🔍 Intentando acceder al secreto: ${secretName}`);
    const secret = await client.getSecret(secretName);
    console.log(`✅ Secreto "${secretName}" recuperado correctamente:`);
    console.log(`   🔑 Valor: ${secret.value}`);
  }

  console.log('\n----------------------------------------------');
  console.log('✅ Verificación de Key Vault finalizada con éxito.');
}

listarSecretos().catch((err) => {
  console.error('❌ Error al acceder al Key Vault:', err.message);
});
