# Markdown Gravity

Editor Markdown minimale per homelab.

## Esecuzione Locale

1. Installazione:
```bash
npm install
```

2. Avvio:
```bash
npx next dev
```

## Esecuzione Docker

```bash
docker compose up -d --build
```

## Docker Compose

```yaml
version: '3'
services:
  markdown-gravity:
    build: .
    container_name: markdown-gravity
    ports:
      - '3000:3000'
    volumes:
      - ./data:/app/data
    restart: always
```

## Permessi

```bash
chmod -R 777 ./data
```