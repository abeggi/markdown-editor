FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Installiamo tutto per il build
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Installa su-exec per permetterci di retrocedere da root a utente normale
RUN apk add --no-cache su-exec

# Copiamo solo il necessario. Se public non esiste, non bloccare tutto.
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
# Copia la config indipendentemente dall'estensione
COPY --from=builder /app/next.config.* ./ 

# Crea la cartella dati e copia l'entrypoint script
RUN mkdir -p data && chown -R node:node /app

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Rimuovo l'istruzione USER node.
# Il container parte come root per eseguire l'entrypoint (che fa chown),
# e poi passerà l'esecuzione dei comandi all'utente specificato via PUID/PGID usando su-exec.
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "start"]

