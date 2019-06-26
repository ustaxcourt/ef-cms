#!/bin/bash -e
docker build -t efcms-build -f ../Dockerfile ..
docker run --rm efcms-build /bin/sh -c 'cd web-api && ./run-shellcheck.sh'