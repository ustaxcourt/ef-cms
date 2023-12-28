#!/bin/bash -e

# shellcheck disable=SC1091 # this file does exist, we promise
source ../bin/deploy-init.sh

terraform state rm aws_elasticsearch_domain.efcms-logs
terraform import aws_opensearch_domain.efcms-logs info
terraform plan
