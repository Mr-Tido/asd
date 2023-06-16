import * as Joi from 'joi';

export const getJoiSchema = () =>
    Joi.object({
        NODE_ENV: Joi.string()
            .valid('development', 'production', 'local')
            .default('development'),

        BACKEND_PORT: Joi.number().default(3000),

        HOST: Joi.string().default('localhost'),

        ADMIN_EMAIL: Joi.string()
            .email({ tlds: { allow: false } })
            .default('admin@example.com'),
        ADMIN_PASSWORD: Joi.string().default('password'),

        POSTGRES_HOST: Joi.string(),
        POSTGRES_USERNAME: Joi.string(),
        POSTGRES_PASSWORD: Joi.string(),
        POSTGRES_PORT: Joi.string().default(5432),

        MAIL_SENDER_LOGIN: Joi.string().email({ tlds: { allow: false } }),
        MAIL_SENDER_PASSWORD: Joi.string(),
        MAIL_HOST: Joi.string(),
    });
