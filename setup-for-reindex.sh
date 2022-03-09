#!/bin/bash

aws es describe-elasticsearch-domain --domain-name "efcms-search-${ENV}-${NEXT_VERSION}" --region us-east-1
CODE=$?
echo "ES describe exit code was ${CODE}."
if [[ "${CODE}" == "1" ]]; then
  export REINDEX_FLAG=true
fi
