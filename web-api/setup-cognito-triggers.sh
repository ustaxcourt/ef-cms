#!/bin/bash

aws cognito-idp update-user-pool --user-pool-id us-east-1_7uRkF0Axn --lambda-config PostConfirmation=arn:aws:lambda:us-east-1:515554424717:function:do-stuff-dev --region us-east-1

aws cognito-idp update-user-pool --user-pool-id us-east-1_7uRkF0Axn --admin-create-user-config "AllowAdminCreateUserOnly=false" --region us-east-1

aws cognito-idp update-user-pool --user-pool-id us-east-1_7uRkF0Axn --admin-create-user-config '{"AllowAdminCreateUserOnly": false}' --region us-east-1

aws cognito-idp update-user-pool --user-pool-id us-east-1_7uRkF0Axn --admin-create-user-config '{"AllowAdminCreateUserOnly": false,"UnusedAccountValidityDays": 6}' --region us-east-1

aws cognito-idp update-user-pool --user-pool-id us-east-1_7uRkF0Axn --sms-authentication-message "{####}" --region us-east-1


--sms-authentication-message