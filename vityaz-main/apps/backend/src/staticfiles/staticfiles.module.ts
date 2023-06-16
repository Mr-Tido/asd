import { StaticController } from '@/staticfiles/staticfiles.controller';
import { StaticService } from '@/staticfiles/staticfiles.service';
import { CryptoProvider } from '@/shared/crypto.provider';
import { Module } from '@nestjs/common';

@Module({
    providers: [StaticService, CryptoProvider],
    controllers: [StaticController],
    exports: [StaticService],
})
export class StaticModule {}
