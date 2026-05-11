#!/bin/bash

# Produces qpdf_lambda_layer.zip in this directory. Run by CircleCI on every
# pipeline (parallel to the puppeteer layer's build.sh). Mirrors the
# puppeteer build pattern.
#
# Why Docker for this layer (unlike puppeteer's bash-only build): qpdf is a
# native C++ binary, so it must be compiled/linked against the same libc /
# libjpeg / etc. as the deployed Lambda runtime. The AL2023 Lambda base image
# guarantees binary compatibility.

set -euo pipefail

cd "$(dirname "$0")"

docker build -t qpdf-layer -f Dockerfile .
docker run --name qpdf-layer qpdf-layer
docker cp qpdf-layer:/home/build/qpdf_lambda_layer.zip .
docker rm qpdf-layer
