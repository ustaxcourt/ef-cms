#!/bin/bash

curl -X DELETE "localhost:9200/efcms"
ELASTICSEARCH_PORT=9200 ELASTICSEARCH_PROTOCOL="http" node ./web-api/elasticsearch/elasticsearch-index-settings.js
