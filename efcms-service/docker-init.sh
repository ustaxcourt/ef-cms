#!/bin/bash
npm_config_cache="${npm_config_cache}" # prevent shellcheck err
docker build -t efcms-build -f ../Dockerfile.build ..
docker run -e "npm_config_cache=${npm_config_cache}" -v "${npm_config_cache}:${npm_config_cache}" --rm efcms-build /bin/sh -c 'echo "init completed"'