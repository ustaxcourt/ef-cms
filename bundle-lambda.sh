#!/bin/bash

handlerPath=$1
zipName=$2

rm -rf dist-lambdas

npx esbuild $1 \
    --bundle \
    --target=esnext \
    --format=esm \
    --platform=node \
    --loader:.node=file \
    --keep-names \
    --outfile=dist-lambdas/$2/$2.mjs \
    --banner:js="import { createRequire as topLevelCreateRequire } from 'module'; const require = topLevelCreateRequire(import.meta.url);"

mkdir -p dist-lambdas/$2

pushd dist-lambdas/$2
  zip -r $2.zip *
popd

