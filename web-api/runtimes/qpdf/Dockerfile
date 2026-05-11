# Builds a Lambda layer that ships the `qpdf` native binary and its runtime
# dependencies. Only the api_async_lambda attaches this layer; everything else
# stays on pdf-lib. Used exclusively by the externally-filed serve flow when
# assembling cover-attached and paper-service PDFs for very large documents.
#
# Build against the actual Amazon Linux 2023 Lambda runtime image so the
# native binary and shared libs match the deployed environment. On arm64
# Macs, pass --platform=linux/amd64 when invoking docker (see build-local.sh).
FROM public.ecr.aws/lambda/nodejs:24

RUN dnf install -y qpdf zip findutils

# Lambda layer convention: /opt/bin is on PATH, /opt/lib is on LD_LIBRARY_PATH.
# Stage them under /home/build so the zip's top-level dirs land in /opt at
# layer-extract time.
WORKDIR /home/build
RUN mkdir -p bin lib && \
    cp /usr/bin/qpdf bin/qpdf && \
    ldd /usr/bin/qpdf | awk '/=>/ {print $3}' | xargs -I{} cp -L {} lib/ && \
    zip -r qpdf_lambda_layer.zip bin lib

# Allow `docker run` to be a no-op — `docker cp` is what pulls the zip out.
CMD ["echo", "qpdf layer zip has been created at /home/build/qpdf_lambda_layer.zip"]
