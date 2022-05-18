#!/bin/bash

set -e

git clean -fd
git reset --hard
git pull
npm install
npm run build
npm run start
