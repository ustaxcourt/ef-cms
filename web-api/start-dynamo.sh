#!/bin/bash

# Usage
#   downloads and starts the dynamodb local service

# download the dynamo jar file if needed
if [ ! -e ".dynamodb/dynamo.tar.gz" ]; then
  mkdir -p .dynamodb
  curl --create-dirs -o .dynamodb/dynamo.tar.gz https://s3.us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz
  cd .dynamodb || exit
  tar -xvf dynamo.tar.gz
  cd .. || exit
fi

if [[ $(uname -m) == 'arm64' ]] || [[ ! -f .dynamodb/DynamoDBLocal_lib/libsqlite4java-osx-arm64.dylib ]]; then
  cd .dynamodb/DynamoDBLocal_lib || exit
  curl -o 'libsqlite4java-osx-arm64.dylib' 'https://repo1.maven.org/maven2/io/github/ganadist/sqlite4java/libsqlite4java-osx-arm64/1.0.392/libsqlite4java-osx-arm64-1.0.392.dylib'
  lipo -create -output libsqlite4java-osx.dylib.fat libsqlite4java-osx.dylib libsqlite4java-osx-arm64.dylib
  mv libsqlite4java-osx.dylib.fat libsqlite4java-osx.dylib
  cd ../.. || exit
fi

# start dynamo 
cd .dynamodb && java -Djava.library.path=.dynamodb/DynamoDBLocal_lib -jar DynamoDBLocal.jar -inMemory
