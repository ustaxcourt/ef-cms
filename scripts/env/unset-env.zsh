#!/bin/zsh

# unset everything in .env
ENV_KEYS=$(awk -F'=' '{print $1}' .env)
KEYS="${ENV_KEYS}"

echo "$KEYS" | while read -r key; do
   unset "$key"
done
