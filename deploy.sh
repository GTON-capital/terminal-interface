#!/bin/bash

set -e

git clean -fd
git reset --hard
git pull

docker --version


