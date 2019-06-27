FROM cypress/base:10.15.3

WORKDIR /home/build

COPY package.json /home/build/puppeteer/package.json
COPY package-lock.json /home/build/puppeteer/package-lock.json
RUN cd /home/build/puppeteer/ && npm i

RUN cd ..
RUN tar -czf puppeteer_lambda_layer.tar.gz puppeteer

CMD echo "tar has been created"
