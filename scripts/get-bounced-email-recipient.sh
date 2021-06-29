#!/bin/bash

# Returns the email address to which we should send bounced service emails

# Usage
#   ./get-bounced-email-recipient.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo "${BOUNCED_EMAIL_RECIPIENT_DEV}"
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo "${BOUNCED_EMAIL_RECIPIENT_EXP1}"
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo "${BOUNCED_EMAIL_RECIPIENT_EXP2}"
elif [[ $BRANCH == 'experimental3' ]] ; then
  echo "${BOUNCED_EMAIL_RECIPIENT_EXP3}"
elif [[ $BRANCH == 'experimental4' ]] ; then
  echo "${BOUNCED_EMAIL_RECIPIENT_EXP4}"
elif [[ $BRANCH == 'irs' ]] ; then
  echo "${BOUNCED_EMAIL_RECIPIENT_IRS}"
elif [[ $BRANCH == 'test' ]] ; then
  echo "${BOUNCED_EMAIL_RECIPIENT_TEST}"
elif [[ $BRANCH == 'migration' ]] ; then
  echo "${BOUNCED_EMAIL_RECIPIENT_MIG}"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "${BOUNCED_EMAIL_RECIPIENT_STG}"
elif [[ $BRANCH == 'master' ]] ; then
  echo "${BOUNCED_EMAIL_RECIPIENT_PROD}"
elif [[ $BRANCH == 'prod' ]] ; then
  echo "${BOUNCED_EMAIL_RECIPIENT_PROD}"
else
  exit 1;
fi
