#!/bin/bash

ENVIRONMENT=$1
DOMAIN=ustc-case-mgmt.flexion.us
SUBDOMAIN="documents-${ENVIRONMENT}.${DOMAIN}"
STACKNAME="ef-cms-${ENVIRONMENT}"
HOSTEDZONE=$(aws route53 list-hosted-zones --query 'HostedZones[?Name==`'${DOMAIN}'.`].Id' --output text)
USEAST1DOMAIN=$(aws cloudformation describe-stacks --stack-name "${STACKNAME}" --region us-east-1 --query "Stacks[0].Outputs[?OutputKey==\`DomainName\`].OutputValue" --output text)
USEAST2DOMAIN=$(aws cloudformation describe-stacks --stack-name "${STACKNAME}" --region us-east-2 --query "Stacks[0].Outputs[?OutputKey==\`DomainName\`].OutputValue" --output text)

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
                  "Value":"'"${USEAST1DOMAIN}"'"
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
            "SetIdentifier":"us-east-2",
            "Region":"us-east-2",
            "ResourceRecords":[
               {
                  "Value":"'"${USEAST2DOMAIN}"'"
               }
            ]
         }
      }
   ]
}'