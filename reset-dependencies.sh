#!/bin/bash

pushd shared
rm -rf node_modules
rm package-lock.json
npm ci
popd

pushd web-api
rm -rf node_modules
rm package-lock.json
npm ci
popd

pushd web-client
rm -rf node_modules
rm package-lock.json
npm ci
popd
