# Markdown Gravity


# Markdown Gravity 🖋️

Editor Markdown minimale e veloce, ottimizzato per l'esecuzione in homelab su Proxmox/LXC con storage persistente. Supporta la modifica visuale (WYSIWYG) e sorgente, il caricamento di file locali e la gestione (rinomina/eliminazione) dei file sul server.

## 🛠️ Architettura
- **Frontend**: Next.js 14, Tiptap Editor, Tailwind CSS.
- **Backend**: Next.js API Routes (filesystem locale).
- **Storage**: Cartella `./data` (mappata su volume persistente).

---

## 🚀 Esecuzione in Locale (Sviluppo)

Utile per testare modifiche rapide senza buildare l'immagine Docker.

1. **Requisiti**: Node.js 20+ installato.
2. **Installazione**:
```bash
npm install
```

3. **Avvio**:
```bash
npx next dev
```

4. **Accesso**: L'app sarà disponibile su `http://localhost:3000`.

---

## 🐳 Esecuzione con Docker (Produzione)

Questa è la modalità consigliata per l'uso quotidiano sul tuo server. Evita il "compiling" continuo, ottimizza le risorse e garantisce che l'app sia pronta istantaneamente.

### 1. Build e Avvio
Dalla root del progetto:
```bash
docker compose up -d --build
```

### 2. Docker Compose (`docker-compose.yml`)
Il servizio è configurato per mantenere i dati persistenti nella cartella locale:

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

---

## 📂 Gestione File e Permessi

I file Markdown vengono salvati nella cartella `./data`.

- **Permessi (LXC/Proxmox)**: Se riscontri errori di salvataggio nel container, assicurati che la cartella ospite abbia i permessi corretti per l'utente Docker:

```bash
chmod -R 777 ./data
```

- **Backup**: È sufficiente fare il backup della cartella `data/` per mettere al sicuro tutte le note. Il repository GitHub è configurato per ignorare questa cartella tramite `.gitignore`.

---

## 📝 Note Tecniche
- **SSR**: L'editor è configurato con `immediatelyRender: false` per prevenire errori di idratazione (hydration mismatch) tipici di Tiptap con Next.js.
- **Dark Mode**: Supportata nativamente con toggle nell'interfaccia.
- **Editor**: Basato su Tiptap con estensioni per Markdown, CodeBlock (lowlight) e StarterKit.
- **Sicurezza**: L'app è pensata per uso in rete locale o via VPN (Tailscale/Mullvad). Se esposta tramite Cloudflare Tunnel, si raccomanda l'uso di Cloudflare Access per l'autenticazione.


