ARG TARGETARCH=amd64
FROM node:24.21.0@sha256:9af606de2e947cfb3f276633b7c5130c4cd22365aa10f5a647b7675d5cfce0c0

RUN apt-get update && \
    apt-get install -y --no-install-recommends awscli && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ARG AWS_REGION
ARG WEBSOCKET_API_GATEWAY_ID

ENV AWS_REGION=${AWS_REGION}
ENV WEBSOCKET_API_GATEWAY_ID=${WEBSOCKET_API_GATEWAY_ID}

WORKDIR /usr/src/app

COPY . .
RUN npm ci

RUN npm install -g ts-node@10.9.2 typescript@npm:@typescript/typescript6@6.0.2
CMD ["ts-node", "src/docketEntryBatchDownloader.ts"]
