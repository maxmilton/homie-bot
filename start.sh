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

err_handler () {
  [ $? -eq 0 ] && exit

  # clean up
  rm /tmp/homie-bot.pid
}

trap err_handler EXIT
