#!/bin/bash

set -e

git clean -fd
git reset --hard
git pull
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
npm i
npm run dev
