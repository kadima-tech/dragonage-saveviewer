#!/usr/bin/env bash

# Fix parallel-js: it has a non-utf-8 at the start of its package.json file
# Remove it.
CONTENT=`cat node_modules/paralleljs/package.json`
echo ${CONTENT:1:${#CONTENT}} > node_modules/paralleljs/package.json
