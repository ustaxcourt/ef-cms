#!/bin/bash

# this should only be ran from inside a container built from our `Dockerfile`

echo "running npm ci... this may take a while"

npm ci
npm run test:pdf-output
node image-compare-pdfs.js
