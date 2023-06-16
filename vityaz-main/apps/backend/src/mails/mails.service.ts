import { Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as process from 'process';

@Injectable()
export class MailsService {
    constructor(
        @Inject(MailerService)
        private readonly mailerService: MailerService,
    ) {}

    public async sendMail(receiver: string, subject: string, text: string) {
        await this.mailerService.sendMail({
            to: receiver,
            from: process.env.SENDER_LOGIN,
            subject,
            text,
        });
    }
}
