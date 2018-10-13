#!/bin/sh
set -euo pipefail

export NODE_ENV=production
export PORT=8080
nohup node ./dist/index.js &
PID=$!

echo $PID > /tmp/homie-bot.pid

echo "Started node server with PID ${PID}"
echo ""
echo "To view logs, run this command:"
echo "  tail -f ./nohup.out"
echo ""
