#!/usr/bin/env bash
set -e

# This script waits for different services to come online before returning

# Usage
#   wait-until-services.sh

( ! command -v curl > /dev/null ) && echo "curl was not found on your path. Please install curl." && exit 1

URL=http://localhost:4000/api/swagger ./wait-until.sh
URL=http://localhost:9200/ ./wait-until.sh

if [[ -n "${WAIT_FOR_CLIENT}" ]]; then
  URL=http://localhost:1234/ ./wait-until.sh
fi

if [[ -n "${WAIT_FOR_PUBLIC}" ]]; then
  URL=http://localhost:5678/ ./wait-until.sh
fi
