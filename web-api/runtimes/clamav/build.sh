#!/bin/bash	
docker build --no-cache -t clamav -f Dockerfile .	
docker run --name clamav clamav	
docker cp clamav:/home/build/clamav_lambda_layer.tar.gz .	
docker rm clamav 	
