import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Магазин «Витязь»')
    .setVersion('1.0')
    .addTag('Аутентификация')
    .addTag('Для администратора')
    .addTag('Товары')
    .addTag('Пользователи')
    .addTag('Корзина')
    .addTag('Заказы')
    .build();
