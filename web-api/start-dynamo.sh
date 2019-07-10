#!/bin/bash

# download the dynamo jar file if needed
if [ ! -e ".dynamodb/dynamo.tar.gz" ]; then
  mkdir -p .dynamodb
  cd .dynamodb
  curl --create-dirs -o dynamo.tar.gz http://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz
  tar -xvf dynamo.tar.gz && cd ..
fi

# start dyanmo
cd .dynamodb && java -Djava.library.path=.dynamodb/DynamoDBLocal_lib -jar DynamoDBLocal.jar -inMemory -sharedDb
