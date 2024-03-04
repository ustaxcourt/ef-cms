#!/bin/bash

# Returns active ruleset for an AWS SES account

# Usage
#   ./get-ses-ruleset.sh dev

# Arguments
#   - $1 - the environment to check

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1

ACTIVE_SES_RULESET=$(aws ses describe-active-receipt-rule-set | jq -r ".Metadata.Name")

echo $ACTIVE_SES_RULESET
