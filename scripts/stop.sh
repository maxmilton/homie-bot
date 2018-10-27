#!/bin/sh
set -euo pipefail

DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

PID=$(cat "$DIR"/homie-bot.pid)
kill $PID || true
rm -f "$DIR"/homie-bot.pid
