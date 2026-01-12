#!/usr/bin/env bash

if ! command -v node &> /dev/null; then
    echo "Node.js is not installed."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "npm is not installed."
    exit 1
fi

if ! command -v http-server &> /dev/null; then
    echo "http-server not found. Install globally by running $(npm install -g http-server)."
    exit 1
fi

echo "Starting presentation server."
npx http-server -p 9999
