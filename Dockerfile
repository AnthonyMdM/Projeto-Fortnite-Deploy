# ------------------------------------------
# BASE
# ------------------------------------------
FROM node:20-slim AS base
WORKDIR /app

# Copia manifests e instala deps
COPY package.json package-lock.json ./
RUN npm ci

# Gera o Prisma Client AQUI!
COPY prisma ./prisma
RUN npx prisma generate

# ------------------------------------------
# BUILD
# ------------------------------------------
FROM node:20-slim AS build
WORKDIR /app

ENV NODE_ENV=production

# Reaproveita node_modules do base
COPY --from=base /app/node_modules ./node_modules
# Copia todo o código
COPY . .

# Gera o build de produção
RUN npm run build

# ------------------------------------------
# RUNNER (PRODUCTION)
# ------------------------------------------
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Só o que é necessário pra rodar o app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/public ./public
COPY --from=build /app/middleware.ts ./middleware.ts


EXPOSE 3000

CMD ["npm", "run", "start"]