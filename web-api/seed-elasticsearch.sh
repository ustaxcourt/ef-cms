#!/bin/bash

curl -X DELETE "$ELASTICSEARCH_HOST:9200/efcms-case"
curl -X DELETE "$ELASTICSEARCH_HOST:9200/efcms-case-deadline"
curl -X DELETE "$ELASTICSEARCH_HOST:9200/efcms-docket-entry"
curl -X DELETE "$ELASTICSEARCH_HOST:9200/efcms-user"
curl -X DELETE "$ELASTICSEARCH_HOST:9200/efcms-message"
curl -X DELETE "$ELASTICSEARCH_HOST:9200/efcms-work-item"
ELASTICSEARCH_PORT=9200 \
  ELASTICSEARCH_PROTOCOL="http" \
  npx ts-node ./web-api/elasticsearch/elasticsearch-index-settings.js "${ELASTICSEARCH_ENDPOINT}"
