#!/bin/sh
set -euo pipefail

PID=$(cat /tmp/homie-bot.pid)
kill $PID || true
rm -f /tmp/homie-bot.pid
