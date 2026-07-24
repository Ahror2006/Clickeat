# ClickEat

Веб-приложение доставки еды с клиентским интерфейсом, панелью сотрудника,
админ-панелью и отслеживанием заказов в реальном времени.

## Стек

- React 19, TypeScript, Vite и Tailwind CSS
- Node.js, Express и MongoDB/Mongoose
- Socket.IO для статусов заказа и положения курьера

## Требования

- Node.js 20.19 или новее
- MongoDB (локальная или MongoDB Atlas)

## Локальный запуск

1. Скопируйте `.env.example` в `.env`.
2. Скопируйте `backend/.env.example` в `backend/.env` и заполните значения.
3. Установите и запустите backend:

   ```bash
   cd backend
   npm ci
   npm run dev
   ```

4. В другом терминале запустите frontend:

   ```bash
   npm ci
   npm run dev
   ```

Frontend откроется по адресу `http://localhost:5173`, backend — на порту 5000.

## Переменные окружения

Frontend:

- `VITE_API_URL` — адрес backend без `/api`.

Backend:

- `MONGO_URI` — строка подключения MongoDB.
- `JWT_SECRET` — длинный случайный секрет подписи токенов.
- `CLIENT_URL` — разрешённый адрес frontend.
- `PORT` — порт сервера, по умолчанию 5000.

## Роли

Публичная регистрация всегда создаёт пользователя с ролью `client`. Роли
`employee` и `admin` назначаются администратором. Для первоначального создания
администратора можно временно задать `RESET_USER_EMAIL`, `RESET_USER_PASSWORD`
и `RESET_USER_ROLE=admin`, выполнить `npm run reset-user`, а затем удалить эти
значения из окружения.

## Проверки

```bash
npm run lint
npm run build
cd backend
npm audit
```

Секреты и файлы `.env` не должны попадать в Git.
