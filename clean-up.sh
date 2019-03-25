#!/usr/bin/env bash

pushd shared
rm -rf node_modules
rm package-lock.json
npm i
popd

pushd efcms-service
rm -rf node_modules
rm package-lock.json
npm i
popd

pushd web-client
rm -rf node_modules
rm package-lock.json
npm i
popd