#!/bin/bash

# download the elasticsearch archive if needed
if [ -f /.dockerenv ]; then
  ES_DOWNLOAD="https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.4.0-linux-x86_64.tar.gz"
else 
  ES_DOWNLOAD="https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.4.0-darwin-x86_64.tar.gz"
fi

ES_ARCH_RENAMED="elasticsearch.tar.gz"
ES_DESTINATION=".elasticsearch/"

if [ ! -d "$ES_DESTINATION" ]; then
  mkdir -p "$ES_DESTINATION"
  curl "$ES_DOWNLOAD" --output "${ES_DESTINATION}/${ES_ARCH_RENAMED}" --create-dirs
  cd "$ES_DESTINATION" && tar -xvf "$ES_ARCH_RENAMED" --strip-components=1 && cd ..
fi

# start elasticsearch
if [ -f /.dockerenv ]; then
  useradd elasticsearch
  chown elasticsearch:elasticsearch -R .elasticsearch
  su -c "JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64 .elasticsearch/bin/elasticsearch" elasticsearch
else
  .elasticsearch/bin/elasticsearch
fi
