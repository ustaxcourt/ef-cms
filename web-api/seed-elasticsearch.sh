#!/bin/bash

curl -X DELETE "localhost:9200/efcms"

curl -X PUT "localhost:9200/efcms?pretty" -H 'Content-Type: application/json' -d'
{
    "settings" : {
        "index" : {
            "number_of_shards" : 5,
            "number_of_replicas" : 1
        },
        "index.mapping.total_fields.limit": "2000"
    }
}
'