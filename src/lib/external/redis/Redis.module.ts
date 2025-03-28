import { Module, Global } from '@nestjs/common';
import { RedisService } from './Redis.service';
import { KeyVaultModule } from '../key-vault/KeyVault.module';

@Global()
@Module({
  imports: [KeyVaultModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
