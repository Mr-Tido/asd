<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" />
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Установка
Для запуска проекта на какой-либо машине/сервере требуется установленные **NodeJS**, **Yarn** и **Docker**. После установки перечисленных инструментов, требуется подготовить проект к запуску.
```bash
# Установка пакетов проекта
$ yarn install
```

## Запуск проекта
Запуск проекта имеет два варианта - запуск каждого приложения по-отдельности, либо же запуск всех приложений разом. Ниже рассматривается последний вариант.
```bash
# Команды прописываются в корне проекта

# Development mode - Запуск проекта в режиме разработки
$ yarn start:dev

# Production mode - Запуск проекта в продакшен режиме
$ yarn start:prod
```

