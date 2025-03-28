import { Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { KeyVaultService } from '../key-vault/KeyVault.service';
import { ConfigService } from '@nestjs/config';
import { REDIS_TTL } from '@/lib/config/AppConfig';

@Injectable()
export class RedisService {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);

  constructor(
    private readonly keyVaultService: KeyVaultService,
    private readonly configService: ConfigService,
  ) {
    this.connect();
  }
  async connect(): Promise<void> {
    const { AZURE_REDIS_URL, AZURE_REDIS_PASSWORD } =
      await this.getCredentials();
    const redisUrl =
      this.configService.get<string>('redis.host') || AZURE_REDIS_URL;
    const redisPass =
      this.configService.get<string>('redis.password') || AZURE_REDIS_PASSWORD;
    this.client = createClient({
      url: `redis://${redisUrl}:6380`,
      password: redisPass,
      socket: {
        tls: true,
        connectTimeout: 10000,
        keepAlive: 10000,
        reconnectStrategy: (retries: number) => {
          this.logger.warn(
            `Redis client retrying connection... Attempt #${retries}`,
          );
          if (retries > 10) {
            this.logger.error('Max reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    this.client.on('connect', () => {
      this.logger.log('Redis client connected');
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client is ready');
    });

    this.client.on('error', (error: any) => {
      this.logger.error('Redis error:', error);
    });

    this.client.on('end', () => {
      this.logger.warn('Redis connection closed');
    });

    this.client.on('reconnecting', () => {
      this.logger.warn('Redis client reconnecting...');
    });

    this.client.connect().catch((error: any) => {
      this.logger.error('Redis connection error:', error);
      throw error;
    });
  }

  private async getCredentials(): Promise<any> {
    try {
      const keys = ['AZURE-REDIS-URL', 'AZURE-REDIS-PASSWORD'];

      let config = {};

      for (const key of keys) {
        config = {
          ...config,
          [key.replace(/-/g, '_')]: await this.keyVaultService.getSecret(key),
        };
      }
      return config;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    const ttl = this.configService.get<string>('redis.ttl') || REDIS_TTL;
    await this.client.set(key, value, {
      EX: Number(ttl),
    });
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async destroyAllKeys(): Promise<void> {
    await this.client.flushAll();
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const lockKey = `delete_lock:${prefix}`;
    const lock = await this.client.set(lockKey, '1', { NX: true, EX: 30 });

    if (!lock) {
      this.logger.log(
        `Otra instancia ya está ejecutando la eliminación para ${prefix}.`,
      );
      return;
    }

    try {
      const testKeys = await this.client.scan(0, {
        MATCH: `${prefix}*`,
        COUNT: 1,
      });

      if (testKeys.keys.length === 0) {
        this.logger.log(`No hay claves para eliminar con prefijo ${prefix}.`);
        return;
      }

      let cursor = 0;
      do {
        const reply = await this.client.scan(cursor, {
          MATCH: `${prefix}*`,
          COUNT: 50,
        });
        cursor = reply.cursor;
        const keys = reply.keys;
        if (keys.length > 0) {
          await this.client.del(keys);
          this.logger.log(`Eliminadas ${keys.length} claves : ${keys}.`);
        }
      } while (cursor !== 0);

      this.logger.log(`Proceso de eliminación completado para ${prefix}.`);
    } catch (error) {
      this.logger.error(`Error al eliminar claves para ${prefix}:`, error);
    } finally {
      await this.client.del(lockKey);
    }
  }
}
