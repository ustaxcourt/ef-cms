#!/bin/bash
docker build -t puppeteer -f Dockerfile .
docker run --name puppeteer puppeteer
docker cp puppeteer:/home/build/puppeteer_lambda_layer.tar.gz .
docker rm puppeteer
