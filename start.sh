#!/bin/sh
set -euo pipefail
export NODE_ENV=production
export PORT=8080
nohup node ./dist/index.js &
PID=$!
echo $PID > /tmp/homie-bot.pid
echo "Started node server with PID ${PID}"
echo "Closing this log (ctrl + c) will not stop the server."
tail -f ./nohup.out
