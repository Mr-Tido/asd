import { MailConfigWorkspace } from '@/config/workspaces/mail.workspace';
import { SupportRequestDto } from '@/support/support.dto';
import { MailsService } from '@/mails/mails.service';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class SupportService {
    constructor(
        @Inject(MailsService)
        private readonly mailsService: MailsService,
        @Inject(MailConfigWorkspace.KEY)
        private readonly mailConfig: ConfigType<typeof MailConfigWorkspace>,
    ) {}

    public sendSupportRequest(
        requestCredentials: SupportRequestDto,
    ): Promise<void> {
        return this.mailsService.sendMail(
            this.mailConfig.receiver.login,
            `Новое обращение к поддержке <${requestCredentials.email}>`,
            this.getMessageText(requestCredentials),
        );
    }

    public getMessageText(credentials: SupportRequestDto): string {
        return (
            `Пользователь: ${credentials.lastname} ${credentials.firstname}\n` +
            `Адрес почты: ${credentials.email}\n\n` +
            `${credentials.message}`
        );
    }

    public sendFeedback(feedbackCredentials: SupportRequestDto): Promise<void> {
        return this.mailsService.sendMail(
            this.mailConfig.receiver.login,
            `Новое отзыв <${feedbackCredentials.email}>`,
            this.getMessageText(feedbackCredentials),
        );
    }
}
