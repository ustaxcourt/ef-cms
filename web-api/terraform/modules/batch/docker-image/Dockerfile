FROM node:20

RUN apt-get update && \
	apt-get install -y awscli && \
	apt-get clean


ARG AWS_REGION
ARG WEBSOCKET_API_GATEWAY_ID

ENV AWS_REGION=${AWS_REGION}
ENV WEBSOCKET_API_GATEWAY_ID=${WEBSOCKET_API_GATEWAY_ID}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g ts-node typescript
CMD ["ts-node", "src/testScript.ts"]
