#!/usr/bin/env bash

# Fix parallel-js: it has a non-utf-8 at the start of its package.json file
# Remove it.
CONTENT=`cat node_modules/paralleljs/package.json`

# Mac and Linux interpret the invalid character differently. Correct for each platform
if [ "$(uname)" == "Darwin" ]; then
  echo ${CONTENT:1:${#CONTENT}} > node_modules/paralleljs/package.json
else
  echo ${CONTENT:3:${#CONTENT}} > node_modules/paralleljs/package.json
fi
