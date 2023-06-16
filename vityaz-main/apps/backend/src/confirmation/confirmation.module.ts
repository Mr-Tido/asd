import { ConfirmationService } from '@/confirmation/confirmation.service';
import { ConfirmationEntity } from '@/confirmation/confirmation.entity';
import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '@/users/users.module';
import { MailsModule } from '@/mails/mails.module';
import { TypeOrmModule } from '@nestjs/typeorm';

const dynamicTypeormModule = TypeOrmModule.forFeature([ConfirmationEntity]);

@Module({
    imports: [dynamicTypeormModule, forwardRef(() => UsersModule), MailsModule],
    providers: [ConfirmationService],
    exports: [dynamicTypeormModule, ConfirmationService],
})
export class ConfirmationModule {}
