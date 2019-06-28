FROM cypress/base:10.15.3

WORKDIR /home/build

RUN apt-get install build-essential zip

RUN cd /home/build/ && git clone --depth=1 https://github.com/alixaxel/chrome-aws-lambda.git
RUN cd /home/build/chrome-aws-lambda && make chrome_aws_lambda.zip

CMD echo "zip has been created"
