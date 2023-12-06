#!/bin/bash

# this file will download and install puppeteer into the current directory and zip up
# all of the node_modules into a `nodejs` directory to be used in a lambda layer.
# note that the `nodejs` directory is a special named directory used on layers: 
#   https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html

npm ci --production
mkdir nodejs
cp -R node_modules nodejs/
cp package.json nodejs/
cp package-lock.json nodejs/
zip -r puppeteer_lambda_layer.zip nodejs
rm -rf nodejs
