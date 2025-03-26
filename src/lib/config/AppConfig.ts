import { config as loadEnv } from 'dotenv';
loadEnv();

const {
  KEYVAULT_SERVICE_URL,
  AZURE_CLIENT_ID,
  AZURE_TENANT_ID,
  AZURE_CLIENT_SECRET,
  BASE_APLICATION_NG_PORT,
  REDIS_TTL,
  DATABASE_SCHEMA,
  API_KEY,
  URL_MOCK,
} = process.env;

export {
  KEYVAULT_SERVICE_URL,
  AZURE_CLIENT_ID,
  AZURE_TENANT_ID,
  AZURE_CLIENT_SECRET,
  BASE_APLICATION_NG_PORT,
  REDIS_TTL,
  DATABASE_SCHEMA,
  API_KEY,
  URL_MOCK,
};
