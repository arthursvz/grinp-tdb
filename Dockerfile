FROM node:22-alpine AS builder

ARG TAG=dev

WORKDIR /app

COPY package.json           .

RUN npm install --loglevel verbose

COPY . .

RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS grinp_website

WORKDIR /app

COPY --from=builder /app/build      /app/build

COPY prisma/                prisma/
COPY entrypoint.sh          .
COPY package.json           .
COPY package-lock.json      .
COPY postcss.config.js      .
COPY tailwind.config.ts     .
COPY components.json        .

RUN npx prisma generate

RUN chmod +x entrypoint.sh
CMD ["./entrypoint.sh"]