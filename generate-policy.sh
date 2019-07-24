#!/bin/bash
ACCOUNT_ID=$1
sed "s/ACCOUNT_ID/$ACCOUNT_ID/g" policy.json.tpl > policy.json