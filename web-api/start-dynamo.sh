#!/bin/bash

# Usage
#   downloads and starts the dynamodb local service

# download the dynamo jar file if needed
if [ ! -e ".dynamodb/dynamo.tar.gz" ]; then
  mkdir -p .dynamodb
  curl --create-dirs -o .dynamodb/dynamo.tar.gz http://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_2021-04-27.tar.gz
  cd .dynamodb && tar -xvf dynamo.tar.gz && cd ..
fi

# start dynamo 
export AWS_ACCESS_KEY_ID=S3RVER
export AWS_SECRET_ACCESS_KEY=S3RVER
cd .dynamodb && java -Djava.library.path=.dynamodb/DynamoDBLocal_lib -jar DynamoDBLocal.jar -inMemory
