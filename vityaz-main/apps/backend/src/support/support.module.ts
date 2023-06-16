import { SupportController } from '@/support/support.controller';
import { SupportService } from '@/support/support.service';
import { MailsModule } from '@/mails/mails.module';
import { Module } from '@nestjs/common';

@Module({
    imports: [MailsModule],
    providers: [SupportService],
    controllers: [SupportController],
    exports: [SupportService],
})
export class SupportModule {}
