# Diary Fullstack Lab

Тестовый fullstack-проект с микрофронтендом:

- `apps/api`: NestJS + Prisma + PostgreSQL + JWT auth
- `apps/web`: основной Next.js frontend (регистрация, личный дневник)
- `apps/feed`: отдельный Next.js микрофронтенд с общей лентой публикаций
- `packages/shared`: общие TypeScript-типы

## Быстрый старт

1. Установить зависимости:

```bash
pnpm install
```

2. Поднять PostgreSQL:

```bash
pnpm db:up
```

3. Скопировать env-файлы:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/feed/.env.example apps/feed/.env.local
```

4. Сгенерировать Prisma Client и накатить миграцию:

```bash
pnpm --filter @diary/api prisma:generate
pnpm --filter @diary/api prisma:migrate
```

5. Запустить все сервисы:

```bash
pnpm dev
```

Приложения будут доступны:

- Web: http://localhost:3000
- Feed microfrontend: http://localhost:3002
- API: http://localhost:4000

## Основные сценарии

- Регистрация и логин пользователя
- Создание личных записей (`diary` / `note` / `article`)
- Публикация записей в общий фид
- Просмотр общего фида через отдельный микрофронтенд (iframe в web)
