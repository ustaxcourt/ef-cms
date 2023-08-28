#!/bin/zsh

# check if we are logged in already
aws sts get-caller-identity &> /dev/null
EXIT_CODE="$?"
if [ "${EXIT_CODE}" != "0" ]; then                   
  aws sso login
fi


# what role do we want to assume?
AWS_ROLE_ARN="arn:aws:iam::${AWS_ACCOUNT_ID}:role/dawson_dev"

AWS_SESSION_INFO=$(aws sts assume-role --role-arn ${AWS_ROLE_ARN} --role-session-name dawson-development)
EXIT_CODE="$?"
if [ "${EXIT_CODE}" != "0" ]; then
  echo "Unable to assume the role in $AWS_ACCOUNT_ID"
  return 1
fi

unset AWS_PROFILE

export AWS_ACCESS_KEY_ID=$(jq -r '.Credentials.AccessKeyId' <<< $AWS_SESSION_INFO)
export AWS_SECRET_ACCESS_KEY=$(jq -r '.Credentials.SecretAccessKey' <<< $AWS_SESSION_INFO)
export AWS_SESSION_TOKEN=$(jq -r '.Credentials.SessionToken' <<< $AWS_SESSION_INFO)

# TODO Think of a smart way to make use of the credentials' expiration
# export AWS_SESSION_EXPIRATION=$(jq -r '.Credentials.Expiration' <<< $AWS_SESSION_INFO)
