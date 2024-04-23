#!/bin/bash -e

# Edits a lambda's environment configuration

# Usage
#   web-api/terraform/bin/edit-lambda-environment.sh -l

############################################################
# Help                                                     #
############################################################
Help()
{
   echo "This script edits a deployed lambda's environment variables."
   echo
   echo "examples:"
   echo "  web-api/terraform/bin/edit-lambda-environment.sh -l streams_test_blue -k LOG_LEVEL -v debug"
   echo "  web-api/terraform/bin/edit-lambda-environment.sh -l streams_test_blue -j '{ \"LOG_LEVEL\": \"debug\" }'"
   echo
   echo "options:"
   echo "h     Print this help."
   echo "l     Lambda to be edited."
   echo "j     New environment variables in JSON format."
   echo "k     Single environment variable to be edited."
   echo "v     Single new value to be set."
   echo "r     Region in which the lambda exists."
   echo
}

while getopts ":hl:j:k:v:r:" option; do
   case $option in
      h) # display Help
         Help
         exit;;
      l) # lambda to be edited
         LAMBDA="$OPTARG"
         ;;
      j) # environment variables in JSON format
         JSON="$OPTARG"
         ;;
      k) # environment variable to be edited
         KEY="$OPTARG"
         ;;
      v) # new value to be set
         VALUE="$OPTARG"
         ;;
      r) # AWS region
         LAMBDA_REGION="$OPTARG"
         ;;
      \?) # Invalid option
         echo "An unsupported option was used. Run with the -h option to see supported options."
         ;;
   esac
done

[[ -z "$LAMBDA" ]] && echo "Lambda to be edited must be provided as the -l parameter." && exit 1
if [[ -z "$JSON" ]]; then
  if [[ -z "$KEY" ]] && [[ -z "$VALUE" ]]; then
    echo "Environment variables must be provided either in JSON format as the -j parameter or in key-value format with the key as the -k parameter and the value as the -v parameter."
    exit 1
  fi
  [[ -z "$KEY" ]] && echo "Environment variable to be edited must be provided as the -k parameter." && exit 1
  [[ -z "$VALUE" ]] && echo "New value must be provided as the -v parameter." && exit 1

  JSON="{ \"${KEY}\": \"${VALUE}\" }"
fi

LAMBDA="$LAMBDA" LAMBDA_ENV="$JSON" LAMBDA_REGION="$LAMBDA_REGION" npx ts-node --transpile-only web-api/terraform/bin/edit-lambda-environment.ts
