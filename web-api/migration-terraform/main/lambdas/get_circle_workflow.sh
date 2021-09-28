#!/bin/bash

curl --request GET \
  --url https://circleci.com/api/v2/workflow/1e3a688d-989d-4377-8d39-cee74fbe18e3 \
  --header 'authorization: Basic REPLACE_BASIC_AUTH'

      - run: echo $CIRCLE_WORKFLOW_ID

# this is the oneeonoenoenoneonoe that approves a pending job
# personal token - 18090418e8dede9c7636a3cf5613fd35f4bd761e
curl --request POST \
  --url https://circleci.com/api/v2/workflow/a4040aba-77ac-47ce-8704-eed3273c1dbd/approve/54c65774-e8ae-49a6-a02d-c772435fb611 \
  --header 'Circle-Token: 18090418e8dede9c7636a3cf5613fd35f4bd761e'

curl --request GET \
  --url https://circleci.com/api/v2/workflow/a4040aba-77ac-47ce-8704-eed3273c1dbd/job \
  --header 'Circle-Token: 1c0bd34bab301a531f056d7cdb8dad640da59c8d'

curl --request POST \
  --url 'https://circleci.com/api/v2/workflow/<>/approve/<>' \
  --header 'authorization: 1c0bd34bab301a531f056d7cdb8dad640da59c8d'

curl --request POST \
  --url https://circleci.com/api/v2/workflow/a4040aba-77ac-47ce-8704-eed3273c1dbd/cancel \
  --header 'authorization: 1c0bd34bab301a531f056d7cdb8dad640da59c8d'


  approval_request_id: "54c65774-e8ae-49a6-a02d-c772435fb611"
