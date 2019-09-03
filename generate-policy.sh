#!/bin/bash
ACCOUNT_ID=$1
if [ -z "$ACCOUNT_ID" ]; then
    echo "Please specify the AWS account ID"
    exit 1
elif [[ ! "$ACCOUNT_ID" =~ ^[0-9]{12}$ ]]; then
    echo "Please specify a valid AWS account ID"
    exit 1
fi

sed "s/ACCOUNT_ID/$ACCOUNT_ID/g" policy.json.tpl > policy.json
