#!/bin/bash

docker build -t clamav -f Dockerfile .
docker run --name clamav clamav
docker cp clamav:/home/build/clamav_lambda_layer.zip .
docker rm clamav
