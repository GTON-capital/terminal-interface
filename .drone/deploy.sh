#!/bin/bash

set -e

git clean -fd
git reset --hard
git pull
export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh
npm i
npm run build
npm run generate
# .
