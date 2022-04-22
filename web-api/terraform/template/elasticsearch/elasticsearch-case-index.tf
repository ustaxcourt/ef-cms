provider "elasticsearch" {
    url = var.elasticsearch_endpoint_alpha
    aws_access_key = "${AWS_ACCESS_KEY_ID}"
    aws_secret_key = "${AWS_SECRET_ACCESS_KEY}"
    alias = "elasticsearch_alpha"
}

provider "elasticsearch" {
    url = var.elasticsearch_endpoint_beta
    aws_access_key = "${AWS_ACCESS_KEY_ID}"
    aws_secret_key = "${AWS_SECRET_ACCESS_KEY}"
    alias = "elasticsearch_beta"
}

terraform {
  required_providers {
    aws = "3.70.0"
    elasticsearch = {
      source = "phillbaker/elasticsearch"
      version = "2.0.0"
    }
  }
}

resource "elasticsearch_index_template" "efcms-case-index" {
  name = "efcms-case"
  body = <<EOF
{
  "settings": {
    "analysis": {
      "analyzer": {
        "english_exact": {
          "filter": ["lowercase"],
          "tokenizer": "standard"
        },
        "ustc_analyzer": {
          "default": {
            "type": "simple"
          },
          "default_search": {
            "type": "stop"
          },
          "filter": [
            "lowercase",
            "asciifolding",
            "english",
            "ustc_stop",
            "filter_stemmer",
            "filter_shingle"
          ],
          "tokenizer": "standard"
        }
      },
      "filter": {
        "english": { "stopwords": "_english_", "type": "stop" },
        "filter_shingle": {
          "max_shingle_size": 3,
          "min_shingle_size": 2,
          "output_unigrams": true,
          "type": "shingle"
        },
        "filter_stemmer": {
          "language": "_english_",
          "type": "porter_stem"
        },
        "ustc_stop": {
          "stopwords": ["tax", "court"],
          "type": "stop"
        }
      }
    },
    "mapping.total_fields.limit": "1000",
    "max_result_window": 20000,
    "number_of_replicas": 2,
    "number_of_shards": 1
  },
  "mappings": {
    "dynamic": false,
    "properties": {
      "associatedJudge.S": {
        "type": "text"
      },
      "automaticBlocked.BOOL": {
        "type": "boolean"
      },
      "automaticBlockedDate.S": {
        "type": "date"
      },
      "automaticBlockedReason.S": {
        "type": "text"
      },
      "blocked.BOOL": {
        "type": "boolean"
      },
      "blockedDate.S": {
        "type": "date"
      },
      "blockedReason.S": {
        "type": "text"
      },
      "caseCaption.S": {
        "type": "text"
      },
      "closedDate.S": {
        "type": "date"
      },
      "docketNumber.S": {
        "type": "keyword"
      },
      "docketNumberSuffix.S": {
        "type": "keyword"
      },
      "docketNumberWithSuffix.S": {
        "type": "keyword"
      },
      "entityName.S": {
        "type": "keyword"
      },
      "hasPendingItems.BOOL": {
        "type": "boolean"
      },
      "indexedTimestamp.N": {
        "type": "text"
      },
      "irsPractitioners.L.M.userId.S": {
        "type": "keyword"
      },
      "isSealed.BOOL": { "type": "boolean" },
      "petitioners.L.M.contactId.S": {
        "type": "text"
      },
      "petitioners.L.M.contactType.S": {
        "type": "keyword"
      },
      "petitioners.L.M.countryType.S": {
        "type": "keyword"
      },
      "petitioners.L.M.name.S": {
        "type": "text"
      },
      "petitioners.L.M.secondaryName.S": {
        "type": "text"
      },
      "petitioners.L.M.state.S": {
        "type": "text"
      },
      "pk.S": {
        "type": "keyword"
      },
      "preferredTrialCity.S": {
        "type": "keyword"
      },
      "privatePractitioners.L.M.userId.S": {
        "type": "keyword"
      },
      "receivedAt.S": {
        "type": "date"
      },
      "sealedDate.S": {
        "type": "date"
      },
      "sk.S": {
        "type": "keyword"
      },
      "sortableDocketNumber.N": {
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        },
        "type": "integer"
      },
      "status.S": {
        "type": "keyword"
      },
      "userId.S": {
        "type": "keyword"
      }
    }
  }
}
EOF
}