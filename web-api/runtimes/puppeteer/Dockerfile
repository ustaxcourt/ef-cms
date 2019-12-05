FROM cypress/base:12.13.0

WORKDIR /home/build

COPY package.json /home/build/nodejs/package.json
COPY package-lock.json /home/build/nodejs/package-lock.json
RUN cd /home/build/nodejs/ && npm i
RUN tar -czf puppeteer_lambda_layer.tar.gz nodejs

CMD echo "tar has been created"
