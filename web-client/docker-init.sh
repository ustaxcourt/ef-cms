#!/bin/bash -e
docker build -t web-client-build -f ../Dockerfile.web-client ..
docker run --rm web-client-build /bin/sh -c 'echo "init completed"'