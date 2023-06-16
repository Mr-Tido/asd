import { TransformInterceptor } from '@/shared/transform.interceptor';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerOptions } from '@/swagger/swagger.options';
import { swaggerConfig } from '@/swagger/swagger.config';
import { SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';

async function bootstrap() {
    const application = await NestFactory.create(AppModule);

    application.setGlobalPrefix('/api/');

    if (!['production', 'test'].includes(process.env.NODE_ENV as string)) {
        enableSwagger(application, 'api/docs');
    }

    application.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    application.enableCors();

    application.useGlobalInterceptors(new TransformInterceptor());

    await application.listen(3000);
}

function enableSwagger(application: INestApplication, path: string) {
    const document = SwaggerModule.createDocument(application, swaggerConfig);
    const options = new SwaggerOptions();
    options.setDarkTheme();
    SwaggerModule.setup(path, application, document, {
        swaggerOptions: {
            supportedSubmitMethods: [],
            defaultModelsExpandDepth: -1,
        },
        ...options,
    });
}

bootstrap();
