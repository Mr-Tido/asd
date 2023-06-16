import { registerAs } from '@nestjs/config';

interface ApplicationConfigWorkspaceType {
    global: {
        mode: string;
        url: string;
        host: string;
        port: number;
    };
}

export const ApplicationConfigWorkspace = registerAs('application', () => {
    const configObject = {
        global: {
            mode: process.env.NODE_ENV,
            url: '',
            host: process.env.HOST,
            port: Number(process.env.BACKEND_PORT),
        },
    } as ApplicationConfigWorkspaceType;
    fillUrlProperty(configObject);

    return configObject;
});

function fillUrlProperty(configuration: ApplicationConfigWorkspaceType) {
    configuration.global.url =
        configuration.global.mode === 'production'
            ? `https://${configuration.global.host}`
            : `http://${configuration.global.host}:${configuration.global.port}`;
}
