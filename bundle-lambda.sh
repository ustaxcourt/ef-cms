#!/bin/bash

rm -rf dist-lambdas

npx esbuild web-api/terraform/template/lambdas/api.ts \
    --bundle \
    --target=esnext \
    --format=esm \
    --platform=node \
    --loader:.node=file \
    --keep-names \
    --outfile=dist-lambdas/api.mjs \
    --banner:js="import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);"

pushd dist-lambdas
  zip -r lambda.zip *
popd

