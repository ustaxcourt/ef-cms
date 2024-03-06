#!/bin/bash

# Returns active ruleset for an AWS SES account

# Usage
#   ./get-ses-ruleset.sh dev

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1

ACTIVE_SES_RULESET=$(aws ses describe-active-receipt-rule-set --region "us-east-1" | jq -r ".Metadata.Name")

echo "$ACTIVE_SES_RULESET"
