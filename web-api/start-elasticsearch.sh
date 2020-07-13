#!/bin/bash

# Usage
#   downloads and starts elasticsearch for local use

# download the elasticsearch archive if needed
if [ -f /.dockerenv ]; then
  ES_DOWNLOAD="https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.5.2-linux-x86_64.tar.gz"
else
  ES_DOWNLOAD="https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-7.5.2-darwin-x86_64.tar.gz"
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
  useradd -m elasticsearch
  chmod -R 755 /home/elasticsearch
  cp -R .elasticsearch/* /home/elasticsearch
  chmod -R 755 /home/elasticsearch/*
  chown elasticsearch:elasticsearch -R /home/elasticsearch/*
  su -c "JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64 /home/elasticsearch/bin/elasticsearch" elasticsearch
else
  cd .elasticsearch && ./bin/elasticsearch
fi
