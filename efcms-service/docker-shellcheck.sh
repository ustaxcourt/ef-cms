#!/bin/bash -e
docker build -t efcms-build -f ../Dockerfile.build ..
docker run --rm efcms-build /bin/sh -c 'cd efcms-service && ./run-shellcheck.sh'