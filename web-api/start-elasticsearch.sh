#!/bin/bash

# download the elasticsearch archive if needed
ES_DOWNLOAD="https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.3.2-darwin-x86_64.tar.gz"
ES_DESTINATION=".elasticsearch"

if [ ! -f "./.elasticsearch/bin/elasticsearch" ]; then
  mkdir -p .elasticsearch/
  curl $ES_DOWNLOAD --output "./.elasticsearch/elasticsearch.tar.gz" --create-dirs
  cd .elasticsearch && tar -xvf "elasticsearch.tar.gz" --strip-components=1 && cd ..
fi

# start elasticsearch
cd .elasticsearch && ./bin/elasticsearch