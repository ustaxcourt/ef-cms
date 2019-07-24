#!/bin/bash -e

ENVIRONMENT=$1
DOMAIN="${EFCMS_DOMAIN}"
SUBDOMAIN="efcms-${ENVIRONMENT}.${DOMAIN}"
HOSTEDZONE=$(aws route53 list-hosted-zones --query "HostedZones[?Name=='${DOMAIN}.'].Id" --output text)
REGION1=$(aws apigateway get-domain-name --domain-name "${SUBDOMAIN}" --region us-east-1 --query "regionalDomainName" --output text)
REGION2=$(aws apigateway get-domain-name --domain-name "${SUBDOMAIN}" --region us-west-1 --query "regionalDomainName" --output text)
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