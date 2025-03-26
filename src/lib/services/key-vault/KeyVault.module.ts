import { Module } from '@nestjs/common';
import { KeyVaultService } from './KeyVault.service';

@Module({
  providers: [KeyVaultService],
  exports: [KeyVaultService],
})
export class KeyVaultModule {}
