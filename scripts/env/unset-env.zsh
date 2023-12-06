#!/bin/zsh

# unset everything in .env
ENV_KEYS=$(awk -F'=' '{print $1}' .env)
KEYS="${ENV_KEYS}"

unset AWS_SESSION_TOKEN AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_PROFILE AWS_ACCOUNT_ID

echo "$KEYS" | while read -r key; do
   unset "$key"
done
