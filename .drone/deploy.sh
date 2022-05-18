#!/bin/bash

set -e

# git clean -fd
# git reset --hard
# git pull
# export NVM_DIR=~/.nvm
# source ~/.nvm/nvm.sh
# npm i
# npm run dev

git clean -fd
git reset --hard
git pull
export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh
npm i
docker build -t cli .
docker run -d -t 6001:3000 --name cli cli