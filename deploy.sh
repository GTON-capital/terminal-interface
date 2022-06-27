#!/bin/bash

set -e

git clean -fd
git reset --hard
git pull

docker --version
docker-compose --version
docker-compose up -d --build --force-recreate
