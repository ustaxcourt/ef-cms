# this dockerfile is needed if building the puppeteer layer from a non-unix machine
ARG TARGETARCH=amd64
FROM node:24.21.0-slim@sha256:51b1100cc2a83d370c6a60952e3f2989c8a43159d0e38586e090f3b3326efefd

WORKDIR /home/build

RUN apt-get update && \
    apt-get install -y --no-install-recommends zip && \
    rm -rf /var/lib/apt/lists/*

COPY package.json /home/build/nodejs/package.json
COPY package-lock.json /home/build/nodejs/package-lock.json
RUN cd /home/build/nodejs/ && npm ci --omit=dev

RUN zip -r puppeteer_lambda_layer.zip nodejs

CMD echo "puppeteer zip has been created"
