#!/bin/bash

# Local developer build of the qpdf layer. The --platform flag forces an
# amd64 build on arm64 Macs so the binary matches the x86_64 Lambda runtime.

set -euo pipefail

cd "$(dirname "$0")"

docker build --platform=linux/amd64 -t qpdf-layer -f Dockerfile .
docker run --platform=linux/amd64 --name qpdf-layer qpdf-layer
docker cp qpdf-layer:/home/build/qpdf_lambda_layer.zip .
docker rm qpdf-layer
