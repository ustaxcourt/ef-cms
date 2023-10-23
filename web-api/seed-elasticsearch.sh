#!/bin/bash

for ELASTICSEARCH_INDEX in $(curl -s -X GET "$ELASTICSEARCH_ENDPOINT/_cat/indices" | awk -F' ' '{print $3}'); do
  curl -X DELETE "${ELASTICSEARCH_ENDPOINT}/${ELASTICSEARCH_INDEX}"
done

ELASTICSEARCH_PORT=9200 \
  ELASTICSEARCH_PROTOCOL="http" \
  npx ts-node --transpile-only ./web-api/elasticsearch/elasticsearch-index-settings.ts "${ELASTICSEARCH_ENDPOINT}"

npx ts-node --transpile-only ./web-api/elasticsearch/elasticsearch-alias-settings.ts "${ELASTICSEARCH_ENDPOINT}"
