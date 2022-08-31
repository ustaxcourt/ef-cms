# Elasticsearch Index Template

When parsing log entries into an index, Elasticsearch will attempt to create a new index with dynamic field mappings if it does not already exist (the normal behavior). We can control how Elasticsearch performs that operation with an Index Template.

Because log entries may contain data which is of an unknown shape and size, it is desirable to [limit the dynamic field mappings](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html#mapping-limit-settings) that occur. Say more!

- Defining too many fields in an index can cause memory errors that are difficult to recover from.
- There are limits in place in Elasticsearch to prevent this from happening.
  - By default, an index will reject new entries if it would cause the field mapping to increase beyond 1,000 fields.
  - By default, Elasticsearch will prevent returning entries from queries with more than 1,000 fields.

## Current Index Template

Terraform 0.13 introduces a new kind of module which may enable us to manage Elasticsearch and Kibana resources through Terraform. Until then, we’re manually updating this Index Template through Kibana’s Dev Tools (the wrench icon).

To view the current templates defined:

```
GET _template
```

To create or update the `cwl` mapping template, which matches the indexes created by `LogsToElasticSearch_info`:

```
PUT _template/cwl
{
  "index_patterns": ["cwl-*"],
  "mappings": {
    "properties": {
      "authorizer": {
        "properties": {
          "error": {
            "type": "text"
          },
          "responseTimeMs": {
            "type": "integer",
            "ignore_malformed": true
          },
          "statusCode": {
            "type": "integer",
            "ignore_malformed": true
          }
        }
      },
      "environment": {
        "properties": {
          "color": {
            "type": "keyword"
          },
          "stage": {
            "type": "keyword"
          }
        }
      },
      "level": {
        "type": "keyword"
      },
      "logGroup": {
        "type": "keyword"
      },
      "logStream": {
        "type": "keyword"
      },
      "message": {
        "type": "text",
        "fields": {
          "raw": {
            "type": "keyword"
          }
        }
      },
      "metadata": {
        "type": "object",
        "dynamic": "false",
        "enabled": false
      },
      "request": {
        "properties": {
          "body": {
            "type": "text",
            "index": false
          },
          "headers": {
            "dynamic": "false",
            "properties": {
              "content-length": {
                "type": "long",
                "ignore_malformed": true
              },
              "x-forwarded-for": {
                "type": "keyword",
                "ignore_malformed": true
              }
            }
          },
          "method": {
            "type": "keyword"
          },
          "url": {
            "type": "keyword"
          }
        }
      },
      "requestId": {
        "properties": {
          "apiGateway": {
            "type": "keyword"
          },
          "applicationLoadBalancer": {
            "type": "keyword"
          },
          "authorizer": {
            "type": "keyword"
          },
          "connection": {
            "type": "keyword"
          },
          "lambda": {
            "type": "keyword"
          }
        }
      },
      "response": {
        "properties": {
          "responseLength": {
            "type": "integer",
            "ignore_malformed": true
          },
          "responseTimeMs": {
            "type": "integer",
            "ignore_malformed": true
          },
          "statusCode": {
            "type": "integer",
            "ignore_malformed": true
          }
        }
      },
      "timestamp": {
        "type": "date"
      },
      "user": {
        "properties": {
          "email": {
            "type": "keyword"
          },
          "name": {
            "type": "text"
          },
          "role": {
            "type": "keyword"
          },
          "userId": {
            "type": "keyword"
          }
        }
      }
    }
  }
```
