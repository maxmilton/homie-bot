#!/bin/sh
set -euo pipefail

# To view logs, run:
#   tail -f ${DIR}/nohup.out

# absolute path to the script's directory
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

export NODE_ENV=production
export PORT=8080
nohup node "$DIR"/dist/index.js &
PID=$!

echo $PID > "$DIR"/homie-bot.pid

echo "Started node server with PID ${PID}"

# clean up when exit with error
err_handler () {
  [ $? -eq 0 ] && exit
  rm "$DIR"/homie-bot.pid
}

trap err_handler EXIT
