FROM cypress/base:12.13.0

WORKDIR /home/build

RUN yum install -y zip

COPY package.json /home/build/nodejs/package.json
COPY package-lock.json /home/build/nodejs/package-lock.json
RUN cd /home/build/nodejs/ && npm ci
RUN zip -r puppeteer_lambda_layer.zip .

CMD echo "zip has been created"
