#!/bin/bash

declare -a users=(
"docketclerk1@example.com"
"docketclerk2@example.com"
"docketclerk3@example.com"
"docketclerk4@example.com"
"docketclerk4@example.com"
"docketclerk5@example.com"
"docketclerk6@example.com"
"docketclerk7@example.com"
"docketclerk8@example.com"
"docketclerk9@example.com"
"docketclerk10@example.com"
"petitionsclerk1@example.com"
"petitionsclerk2@example.com"
"petitionsclerk3@example.com"
"petitionsclerk4@example.com"
"petitionsclerk4@example.com"
"petitionsclerk5@example.com"
"petitionsclerk6@example.com"
"petitionsclerk7@example.com"
"petitionsclerk8@example.com"
"petitionsclerk9@example.com"
"petitionsclerk10@example.com"
"admissionsclerk1@example.com"
"admissionsclerk2@example.com"
"admissionsclerk3@example.com"
"admissionsclerk4@example.com"
"admissionsclerk4@example.com"
"admissionsclerk5@example.com"
"admissionsclerk6@example.com"
"admissionsclerk7@example.com"
"admissionsclerk8@example.com"
"admissionsclerk9@example.com"
"admissionsclerk10@example.com"
"adc1@example.com"
"adc2@example.com"
"adc3@example.com"
"adc4@example.com"
"adc4@example.com"
"adc5@example.com"
"adc6@example.com"
"adc7@example.com"
"adc8@example.com"
"adc9@example.com"
"adc10@example.com"
"clerkofcourt1@example.com"
"clerkofcourt2@example.com"
"clerkofcourt3@example.com"
"clerkofcourt4@example.com"
"clerkofcourt5@example.com"
"clerkofcourt6@example.com"
"clerkofcourt7@example.com"
"clerkofcourt8@example.com"
"clerkofcourt9@example.com"
"clerkofcourt10@example.com"
"trialclerk1@example.com"
"trialclerk2@example.com"
"trialclerk3@example.com"
"trialclerk4@example.com"
"trialclerk5@example.com"
"trialclerk6@example.com"
"trialclerk7@example.com"
"trialclerk8@example.com"
"trialclerk9@example.com"
"trialclerk10@example.com"
)

rm tokens.csv || true
echo "token" >> tokens.csv

for user in "${users[@]}"
do
  echo "$user"
  response=$(aws cognito-idp admin-initiate-auth \
    --user-pool-id "${USER_POOL_ID}" \
    --client-id "${CLIENT_ID}" \
    --region "${REGION}" \
    --auth-flow ADMIN_NO_SRP_AUTH \
    --auth-parameters USERNAME="${user}"',PASSWORD'="${DEFAULT_ACCOUNT_PASS}")
  token=$(echo "${response}" | jq -r ".AuthenticationResult.IdToken")
  echo $token >> tokens.csv
done
