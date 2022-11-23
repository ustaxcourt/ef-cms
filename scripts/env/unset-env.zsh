#!/bin/zsh

# unset everything in .env
ENV_KEYS=$(awk -F'=' '{print $1}' .env)
AWS_ENV_KEYS=$(grep "=" ./scripts/env/aws-accounts/example.env | awk -F'[ =]' '{print $2}')
KEYS="${ENV_KEYS}\n${AWS_ENV_KEYS}"

echo "$KEYS" | while read -r key; do
   unset "$key"
done
