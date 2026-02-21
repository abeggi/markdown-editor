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

