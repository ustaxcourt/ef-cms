#!/bin/bash -e

# This script waits for different services to come online before returning

# Usage
#   wait-until-services.sh

( ! command -v curl > /dev/null ) && echo "curl was not found on your path. Please install curl." && exit 1

URL=http://localhost:4000/ ./wait-until.sh
