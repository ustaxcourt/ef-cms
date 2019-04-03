#!/bin/bash -e
docker build -t shared-build -f ../Dockerfile ..
docker run --rm shared-build /bin/sh -c 'cd shared && ./run-shellcheck.sh'