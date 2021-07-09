#!/bin/bash -e

# Usage
#   script to automate the SES email verification process

# Arguments
#   none

[ -z "${EFCMS_DOMAIN}" ] && echo "You must have EFCMS_DOMAIN set in your environment" && exit 1
[ -z "${REGION}" ] && echo "You must have REGION set in your environment" && exit 1
[ -z "${AWS_ACCESS_KEY_ID}" ] && echo "You must have AWS_ACCESS_KEY_ID set in your environment" && exit 1
[ -z "${AWS_ACCOUNT_ID}" ] && echo "You must have AWS_ACCOUNT_ID set in your environment" && exit 1
[ -z "${AWS_SECRET_ACCESS_KEY}" ] && echo "You must have AWS_SECRET_ACCESS_KEY set in your environment" && exit 1

export AWS_DEFAULT_REGION=$REGION

BUCKET="mail-verify.${EFCMS_DOMAIN}"

# create bucket
aws s3 mb "s3://${BUCKET}" --region "${REGION}"
sed -e "s/BUCKETNAME/${BUCKET}/g" -e "s|AWSACCOUNTID|${AWS_ACCOUNT_ID}|g" "$(dirname "$0")/verify-ses-policy.json" > new-policy.json
aws s3api put-bucket-policy --bucket "${BUCKET}" --policy file://new-policy.json
rm new-policy.json

# create ses rule set
aws ses create-receipt-rule-set --rule-set-name confirm_email_helper
sed -e "s/BUCKETNAME/${BUCKET}/g" "$(dirname "$0")/ses-receipt-rule.json" > new-receipt-rule.json
aws ses create-receipt-rule --rule-set-name confirm_email_helper --rule file://new-receipt-rule.json
aws ses set-active-receipt-rule-set --rule-set-name confirm_email_helper
rm new-receipt-rule.json

# verify email
aws ses verify-email-identity --email-address "noreply@${EFCMS_DOMAIN}"

VERIFICATION_OBJECT_KEY=$(aws s3api list-objects --bucket "${BUCKET}" --query "Contents[?Key != 'AMAZON_SES_SETUP_NOTIFICATION'].Key | [0]" --output text)
aws s3api get-object --bucket "${BUCKET}" --key "${VERIFICATION_OBJECT_KEY}" verification-email.txt
VERIFICATION_LINK=$(cat verification-email.txt | grep -Eo "(http|https)://[a-zA-Z0-9./?=_%:-].*(\?|\&)([^=]+)\=([^&]+)" | tr '\r' '\0')
curl -X GET $VERIFICATION_LINK
rm verification-email.txt

# remove rule set
aws ses delete-receipt-rule --rule-set-name confirm_email_helper --rule-name confirm-email-rule
aws ses set-active-receipt-rule-set
aws ses delete-receipt-rule-set --rule-set-name confirm_email_helper

# delete bucket
aws s3 rm "s3://${BUCKET}" --recursive
aws s3 rb "s3://${BUCKET}"
