FROM cypress/base:10.15.3

WORKDIR /home/build

COPY package.json /home/build/nodejs/package.json
COPY package-lock.json /home/build/nodejs/package-lock.json
RUN cd /home/build/nodejs/ && npm i
RUN tar -czf puppeteer_lambda_layer.tar.gz nodejs

CMD echo "tar has been created"
