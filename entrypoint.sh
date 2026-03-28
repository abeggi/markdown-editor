#!/bin/sh

# Imposta gli UID e GID basati sulle variabili d'ambiente, di default usa 1000:1000
PUID=${PUID:-1000}
PGID=${PGID:-1000}

# Assegna la directory data al nuovo utente
chown -R $PUID:$PGID /app/data

# Esegui il comando di avvio dell'app usando su-exec per togliere i privilegi di root
exec su-exec $PUID:$PGID "$@"
