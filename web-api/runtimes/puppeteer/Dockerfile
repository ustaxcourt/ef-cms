FROM cypress/base:12.13.0

WORKDIR /home/build

RUN apt-get update -y
RUN apt-get install -y zip

COPY package.json /home/build/nodejs/package.json
COPY package-lock.json /home/build/nodejs/package-lock.json
RUN cd /home/build/nodejs/ && npm ci
RUN zip -r puppeteer_lambda_layer.zip nodejs

CMD echo "zip has been created"
