#!/bin/bash

cd shared || exit
rm -rf node_modules
rm package-lock.json
npm i
cd .. || exit

cd web-api || exit
rm -rf node_modules
rm package-lock.json
npm i
cd .. || exit

cd web-client || exit
rm -rf node_modules
rm package-lock.json
npm i
cd .. || exit
