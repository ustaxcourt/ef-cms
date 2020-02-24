#!/bin/bash
ENV=$1

aws sns list-subscriptions-by-topic \
  --topic-arn="arn:aws:sns:us-east-1:$AWS_ACCOUNT_ID:serverless-alerts-topic-$ENV" \
  --region us-east-1 | grep "ustaxcourt@flexion.us"
code=$?

if [ "${code}" -ne "0" ]; then
  echo "no subscription found, creating a subscription"

  aws sns subscribe \
      --topic-arn="arn:aws:sns:us-east-1:$AWS_ACCOUNT_ID:serverless-alerts-topic-$ENV" \
      --protocol email \
      --notification-endpoint="ustaxcourt@flexion.us" \
      --region us-east-1

  aws sns subscribe \
      --topic-arn="arn:aws:sns:us-west-1:$AWS_ACCOUNT_ID:serverless-alerts-topic-$ENV" \
      --protocol email \
      --notification-endpoint="ustaxcourt@flexion.us" \
      --region us-west-1
else
  echo "subscription exists; skipping"
fi
