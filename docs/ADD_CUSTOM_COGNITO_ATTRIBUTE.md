# Add Custom Cognito Attribute

## Introduction

The script `add-cognito-custom-attributes.sh` and this file are only needed 
for story #7377, once the script has been run on all environments, this file
and the script can be deleted.

`add-cognito-custom-attributes.sh` is a temporary script used to add the 
custom attribute `userId` to our cognito user pools without deleting and
recreating them. 

## Running add-cognito-custom-attributes.sh

`./add-cognito-custom-attributes.sh <ENV>`

## After Running Script on All Environments/Post-Run

Set the source repository for elasticsearch logs in `elasticsearch.tf` back
to the link specified in the comment.
We had to fork the repo to remove a defaulted variable that was causing a bug
with the deploy.
