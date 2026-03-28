# Prompt per Ricostruire "Markdown Gravity" con un'Intelligenza Artificiale

Copia e incolla il testo seguente in una nuova chat con un'IA per chiederle di riscrivere da zero l'applicazione.

---

**Obiettivo:**
Voglio creare un'applicazione web chiamata **"Markdown Gravity"**. Si tratta di un editor Markdown minimale e veloce, che supporta la modifica visuale (WYSIWYG) e quella puramente testuale, con il salvataggio automatico/manuale dei file in locale sul server. Deve essere possibile creare, rinominare ed eliminare i file.

**Architettura e Stack Tecnologico:**
- **Framework Frontend/Backend:** Next.js 14 (App Router) con React 18 e TypeScript.
- **Styling:** Tailwind CSS e la libreria `@tailwindcss/typography` per la formattazione pulita del testo Markdown prodotto.
- **Editor:** Utilizza **Tiptap** per l'interfaccia di editing testuale. Nello specifico, avrai bisogno di `@tiptap/react`, `@tiptap/starter-kit`, `tiptap-markdown` e `@tiptap/extension-code-block-lowlight` (con `lowlight` per l'evidenziazione della sintassi del codice).
- **Icone:** Usa `lucide-react`.
- **Backend/Storage:** Usa le classiche Next.js API Routes (Route Handlers nell'App router, e.g. `app/api/...`) per interagire con il filesystem locale (moduli `fs` e `path` nativi di Node.js). I file markdown `.md` vanno salvati in una cartella specifica `./data` situata nella root del progetto.
- **Distribuzione/Esecuzione:** L'app deve essere pensata per girare via Docker usando `node:20-alpine`.

**Funzionalità Principali da Sviluppare:**
1. **L'Editor Tiptap:** 
   - Deve permettere all'utente di scrivere in formato WYSIWYG e produrre/leggere codice Markdown.
   - *Considerazione per Next.js:* Configura l'editor con l'opzione `immediatelyRender: false` su Tiptap per evitare errori di concordanza nell'idratazione (hydration mismatch) tipici del render lato server.
2. **Modalità Scura (Dark Mode):** 
   - L'applicazione deve avere un toggle per inserire e rimuovere nativamente la Dark Mode di Tailwind.
3. **Pannello File:** 
   - A sinistra o in un menu a comparsa (sidebar) deve essere presente una lista dei file salvati nella cartella `./data`. Supporto per cliccare, rinominare (`/api/files/rename`) e cancellare (`/api/files/delete`) tali file.
4. **Volume Docker "Rootless-friendly":**
   - Assicurati che nel `Dockerfile` e nel `docker-compose.yml` ci sia un sistema che mappa i permessi per il volume dei dati (`./data`). Usa `su-exec` o simili tramite un `entrypoint.sh` configurato nel Dockerfile per assegnare la cartella `./data` all'utente effettivo (tramite variabili d'ambiente `PUID` e `PGID`), in modo da permettere allo sviluppatore di non avere problemi con l'utente `root` della cartella creata da docker-compose.

**Setup Iniziale dell'Ambiente:**
Per inizializzare il progetto da zero, la prima cosa da fare è far eseguire questi comandi nel terminale per preparare lo stack base:

```bash
npx create-next-app@latest markdown-gravity --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*"
cd markdown-gravity
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-code-block-lowlight tiptap-markdown lowlight lucide-react @tailwindcss/typography
```

Ricordati che in `tailwind.config.ts` dovrai aggiungere il plugin: `require('@tailwindcss/typography')`.

**Struttura Iniziale e Package Base:**
Tieni in considerazione questo file `package.json` come riferimento dopo il setup:
```json
{
  "name": "markdown-gravity",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "@tiptap/react": "^2.27.2",
    "@tiptap/pm": "^2.2.4",
    "@tiptap/starter-kit": "^2.27.2",
    "@tiptap/extension-code-block-lowlight": "^2.27.2",
    "tiptap-markdown": "^0.8.10",
    "lowlight": "^3.3.0",
    "lucide-react": "^0.344.0",
    "@tailwindcss/typography": "^0.5.10"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.11.20",
    "@types/react": "^18.2.58",
    "@types/react-dom": "^18.2.19",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17"
  }
}
```

E i seguenti comandi di startup:
- Per l'ambiente di sviluppo: `npm install` e `npm run dev`.
- Per la connessione Docker (`docker-compose.yml`):
```yaml
services:
  markdown-gravity:
    build: .
    container_name: markdown-gravity
    ports:
      - '3000:3000'
    environment:
      - PUID=${UID:-1000}
      - PGID=${GID:-1000}
    volumes:
      - ./data:/app/data
    restart: always
```

Per favore, scrivi il codice partendo dai componenti base, includendo le route API per il filesystem, la logica dell'editor Tiptap, fino alla stesura dei file per il deployment via Docker, spiegando ogni passo.

--- 

*Fine del prompt.* Dovrai passarlo esattamente così a una qualsiasi altra Intelligenza Artificiale (come ChatGPT, Claude o simili) in modo che ricrei l'app attenendosi perfettamente ai criteri architettonici attuali.
