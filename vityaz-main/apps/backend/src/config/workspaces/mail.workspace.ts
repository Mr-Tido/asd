import { registerAs } from '@nestjs/config';

type MailConfigWorkspaceType = {
    sender: {
        login: string;
        password: string;
    };
    receiver: {
        login: string;
        password: string;
    };
    host: string;
};

export const MailConfigWorkspace = registerAs(
    'mail',
    () =>
        ({
            sender: {
                login: process.env.SENDER_LOGIN,
                password: process.env.SENDER_PASSWORD,
            },
            receiver: {
                login: process.env.RECEIVER_LOGIN,
                password: process.env.RECEIVER_PASSWORD,
            },
            host: process.env.MAILER_HOST,
        } as MailConfigWorkspaceType),
);
