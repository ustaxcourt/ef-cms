#!/bin/bash

pushd ../management/management
SKIP_KEYGEN=true ./deploy-init.sh
DNS_DOMAIN=$(terraform output dns_domain)
popd

ENVIRONMENT=$1
DOMAIN="${DNS_DOMAIN}"
SUBDOMAIN="documents-${ENVIRONMENT}.${DOMAIN}"
STACKNAME="ef-cms-${ENVIRONMENT}"
HOSTEDZONE=$(aws route53 list-hosted-zones --query 'HostedZones[?Name==`'${DOMAIN}'.`].Id' --output text)
REGION1=$(aws cloudformation describe-stacks --stack-name "${STACKNAME}" --region us-east-1 --query "Stacks[0].Outputs[?OutputKey==\`DomainName\`].OutputValue" --output text)
REGION2=$(aws cloudformation describe-stacks --stack-name "${STACKNAME}" --region us-west-1 --query "Stacks[0].Outputs[?OutputKey==\`DomainName\`].OutputValue" --output text)

aws route53 change-resource-record-sets \
  --hosted-zone-id "${HOSTEDZONE}" \
  --change-batch  '{
   "Comment": "optional comment about the changes in this change batch request",
   "Changes":[
      {
         "Action":"UPSERT",
         "ResourceRecordSet":{
            "Name":"'"${SUBDOMAIN}"'",
            "Type":"CNAME",
            "TTL":300,
            "SetIdentifier":"us-east-1",
            "Region":"us-east-1",
            "ResourceRecords":[
               {
                  "Value":"'"${REGION1}"'"
               }
            ]
         }
      },
      {
         "Action":"UPSERT",
         "ResourceRecordSet":{
            "Name":"'"${SUBDOMAIN}"'",
            "Type":"CNAME",
            "TTL":300,
            "SetIdentifier":"us-west-1",
            "Region":"us-west-1",
            "ResourceRecords":[
               {
                  "Value":"'"${REGION2}"'"
               }
            ]
         }
      }
   ]
}'