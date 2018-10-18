#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

set -o errtrace # trap errors inside functions
trap 'finish; echo_err "Aborting due to failure."' ERR

#
# Homie Bot Deploy Script
#
# README:
#   You can override some options with shell env variables.
#

# options
DIST_FILES=(
  "./dist"
  "./static"
  "./start.sh"
  "./stop.sh"
)
DEPLOY_FILE=${DEPLOY_FILE:-"hb.tar.xz"}
REMOTE_SSH=${DEPLOY_FILE:-"pi"}
REMOTE_PATH=${DEPLOY_FILE:-"~/homie-bot"}

# feedback utilities
echo_err() { echo -e "\\n\\x1B[1;31mError:\\x1B[0m $1" 1>&2; echo -en "\\a\\n"; exit 2; }
echo_info() { echo -e "\\n$1\\n" >&1; }

# check we're on the master git branch
[[ $(git rev-parse --abbrev-ref HEAD) != "master" ]] && echo_err 'Not on git "master" branch.'

# check linting and tests are passing
yarn run lint || echo_err "Linting failed"
yarn run test-ci || echo_err "Running tests suite failed"

# run build ("build" = requires server on backend | "export" = static site)
yarn run build || echo_err "Build failed"

# bundle deployable package
echo_info "Compressing into deployable file..."

tar --create --xz --file "$DEPLOY_FILE" ${DIST_FILES[*]} \
  || { echo_err "Creating deployable file failed!"; exit 2; }

echo_info "Done; $(wc -c "$DEPLOY_FILE")"

echo_info "Uploading package to ${REMOTE_SSH} server..."

upload() {
  # upload deploy file to remote server (in ~ home directory)
  rsync -vv --partial --progress --rsh=ssh "$DEPLOY_FILE" "$REMOTE_SSH":~
}
# try uploading up to 3 times in case of errors
upload || upload || upload || exit 2

# execute commands on the remote server
echo_info "Executing commands on ${REMOTE_SSH} server..."

# NOTE: This will override the existing files but does not clean up old files
ssh "$REMOTE_SSH" DEPLOY_FILE="$DEPLOY_FILE" REMOTE_PATH="$REMOTE_PATH" '/bin/sh -sxeu' <<'ENDSSH'
  mkdir -p $REMOTE_PATH
  tar --extract --xz --file "$DEPLOY_FILE" -C $REMOTE_PATH
  rm "$DEPLOY_FILE"
  cd $REMOTE_PATH
  ./stop.sh
  ./start.sh
ENDSSH

echo_info "Deployment complete!"

# clean up on exit
function finish {
  echo_info "Removing archive: ${DEPLOY_FILE}"
  rm -rf "$DEPLOY_FILE"
}
trap finish EXIT
