FROM node:24-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Instalar pnpm 11
RUN npm install -g pnpm@11

# Copiar configuración del workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared-types/package.json ./packages/shared-types/

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY apps/api ./apps/api
COPY packages/shared-types ./packages/shared-types

# Generar cliente Prisma y compilar
WORKDIR /app/apps/api
RUN pnpm prisma generate
RUN pnpm build

EXPOSE 3000

CMD ["node", "dist/main"]
