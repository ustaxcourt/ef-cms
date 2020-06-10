#!/bin/bash

curl -X DELETE "localhost:9200/efcms-case"
curl -X DELETE "localhost:9200/efcms-document"
curl -X DELETE "localhost:9200/efcms-user"
curl -X DELETE "localhost:9200/efcms-message"
curl -X DELETE "localhost:9200/efcms-user-case"
ELASTICSEARCH_PORT=9200 ELASTICSEARCH_PROTOCOL="http" node ./web-api/elasticsearch/elasticsearch-index-settings.js
