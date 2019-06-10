#!/bin/bash
docker build -t ghostscript -f Dockerfile .
docker run --name ghostscript ghostscript
docker cp ghostscript:/home/build/ghostscript_lambda_layer.tar.gz .
docker rm ghostscript