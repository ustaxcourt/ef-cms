#!/bin/bash -e
docker build -t shared-build -f ../Dockerfile.shared ..
docker run --rm shared-build /bin/sh -c 'echo "init completed"'