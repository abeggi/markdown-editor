FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Installiamo tutto per il build
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

# Copiamo solo il necessario. Se public non esiste, non bloccare tutto.
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
# Copia la config indipendentemente dall'estensione
COPY --from=builder /app/next.config.* ./ 

# Crea la cartella dati
RUN mkdir -p data && chown -R node:node /app

USER node
EXPOSE 3000
CMD ["npm", "start"]

