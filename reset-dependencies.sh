#!/bin/bash

rm -rf node_modules dist package-lock.json
npm i
npm upgrade --dev
