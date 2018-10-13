#!/bin/sh
set -euo pipefail

PID=$(cat /tmp/homie-bot.pid)
kill $PID
