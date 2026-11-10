FROM node:24-slim

WORKDIR /app

# Instalar pnpm 11
RUN npm install -g pnpm@11

# Copiar configuración del workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared-types/package.json ./packages/shared-types/

# Instalar dependencias
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY apps/web ./apps/web
COPY packages/shared-types ./packages/shared-types

# Compilar la aplicación
WORKDIR /app/apps/web
RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]
