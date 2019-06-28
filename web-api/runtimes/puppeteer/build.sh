#!/bin/bash
docker build -t puppeteer -f Dockerfile .
docker run --name puppeteer puppeteer
docker cp puppeteer:/home/build/chrome-aws-lambda/chrome_aws_lambda.zip .
docker rm puppeteer
