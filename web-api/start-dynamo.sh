#!/bin/bash

# download the dynamo jar file if needed
if [ ! -e ".dynamodb/dynamo.tar.gz" ]; then
  mkdir -p .dynamodb
  wget -O .dynamodb/dynamo.tar.gz "https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz"
  pushd .dynamodb
    tar -xvf dynamo.tar.gz
  popd
fi

# start dyanmo
pushd .dynamodb
  java -Djava.library.path=.dynmaodb/DynamoDBLocal_lib -jar DynamoDBLocal.jar -inMemory -sharedDb 
popd
