# --- STAGE 1 : BUILDER ---
FROM node:22-slim AS builder

WORKDIR /app

# Installation OpenSSL
RUN apt-get update -y && apt-get install -y openssl ca-certificates

# Fix Mémoire
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate
RUN npx svelte-kit sync
RUN npm run build
RUN npm prune --production

# --- STAGE 2 : RUNNER ---
FROM node:22-slim AS runner

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl ca-certificates

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

# [CORRECTION] On copie le dossier prisma pour pouvoir faire le db push
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "build/index.js"]
