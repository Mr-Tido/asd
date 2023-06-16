import { ApplicationConfigWorkspace } from '@/config/workspaces/application.workspace';
import { DatabaseConfigWorkspace } from '@/config/workspaces/database.workspace';
import { MailConfigWorkspace } from '@/config/workspaces/mail.workspace';
import { JwtConfigWorkspace } from '@/config/workspaces/jwt.workspace';
import { getJoiSchema } from '@/config/config.scheme';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

export const getConfigurationModule = () =>
    ConfigModule.forRoot({
        envFilePath: join(__dirname, '../../../../.env'),
        isGlobal: true,
        validationSchema: getJoiSchema(),
        validationOptions: { allowUnknows: false, abortEarly: false },
        load: [
            ApplicationConfigWorkspace,
            DatabaseConfigWorkspace,
            MailConfigWorkspace,
            JwtConfigWorkspace,
        ],
    });
