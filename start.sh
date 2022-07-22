#!/bin/sh

echo "Iniciando aplicações"

# nginx -g 'daemon off;' &
node /usr/src/app/backend/index.js &
node /usr/src/app/bank-api/index.js &
nginx -g 'daemon off;'
