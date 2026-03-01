# Fase 1: Build con Node 20 (recomendado para Nuxt 3.20)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Fase 2: Ejecución ligera con Nitro
FROM node:20-alpine
WORKDIR /app
# Nitro genera todo lo necesario en la carpeta .output
COPY --from=builder /app/.output ./.output

# Nuxt 3 usa el puerto 3000 por defecto
ENV PORT=3000
EXPOSE 3000

# Comando de ejecución para el servidor Nitro
CMD ["node", ".output/server/index.mjs"]