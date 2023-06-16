import { MailConfigWorkspace } from '@/config/workspaces/mail.workspace';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailsService } from '@/mails/mails.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule.forFeature(MailConfigWorkspace)],
            inject: [MailConfigWorkspace.KEY],
            useFactory: (config: ConfigType<typeof MailConfigWorkspace>) => ({
                transport: {
                    host: config.host,
                    secure: true,
                    port: 465,
                    auth: {
                        user: config.sender.login,
                        pass: config.sender.password,
                    },
                },
                options: {
                    strict: false,
                },
            }),
        }),
    ],
    providers: [MailsService],
    exports: [MailsService],
})
export class MailsModule {}
