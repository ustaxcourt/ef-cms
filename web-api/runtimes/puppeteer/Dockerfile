# this dockerfile is needed if building the puppeteer layer from a non-unix machine
ARG TARGETARCH=amd64
FROM node:24.14.0-slim

WORKDIR /home/build

RUN apt-get update -y
RUN apt-get install -y zip

COPY package.json /home/build/nodejs/package.json
COPY package-lock.json /home/build/nodejs/package-lock.json
RUN cd /home/build/nodejs/ && npm ci --production

RUN zip -r puppeteer_lambda_layer.zip nodejs

CMD echo "puppeteer zip has been created"
