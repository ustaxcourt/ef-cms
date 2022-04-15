#!/bin/bash

# this should only be ran from inside a container built from our `Dockerfile-integration`

echo "running npm ci... this may take a while"

npm ci

mkdir /tmp/web-client/

CI=true \
TEMP_DOCUMENTS_BUCKET_NAME=noop-temp-documents-local-us-east-1 \
QUARANTINE_BUCKET_NAME=noop-quarantine-local-us-east-1 \
DOCUMENTS_BUCKET_NAME=noop-documents-local-us-east-1 \
S3_ENDPOINT=http://localhost:9000 \
SKIP_CACHE_INVALIDATION=true \
AWS_ACCESS_KEY_ID=S3RVER \
AWS_SECRET_ACCESS_KEY=S3RVER \
npm run start:api:ci > /tmp/web-client/server-output.txt &
URL=http://localhost:4000/api/swagger ./wait-until.sh
URL=http://localhost:9200 ./wait-until.sh
URL=http://localhost:9000/ ./wait-until.sh
URL=http://localhost:8000/shell ./wait-until.sh
sleep 20 # figure out why we need to sleep here since we wait above ^

# these two tests have been the most intermittent in the last month after 9326 was merged into ustc/test
# noticeOfChangeOfAddressQCJourney failed 5 times from 3/22/22 - 4/14/22 on ustc/test
# noticeOfTrialSessionWithPaperService failed 9 times 3/22/22 - 4/14/22 on ustc/test

# tests that might run alongside noticeOfChangeOfAddressQCJourney
# example: https://app.circleci.com/pipelines/github/ustaxcourt/ef-cms/3235/workflows/307be5c0-0ecc-4066-9dbe-749ad45ac0ee/jobs/32518

npm run test:file web-client/integration-tests/admissionsClerkAddsSecondaryPetitionerWithNoAccountToCase.test.js
npm run test:file web-client/integration-tests/caseDeadlineReportJourney.test.js
npm run test:file web-client/integration-tests/chambersViewsWorkingCopyTrialSession.test.js
npm run test:file web-client/integration-tests/docketClerkCaseInventoryReport.test.js
npm run test:file web-client/integration-tests/docketClerkEditsPaperFilingJourney.test.js
npm run test:file web-client/integration-tests/docketClerkSavesAndEditsPaperFiling.test.js
npm run test:file web-client/integration-tests/docketClerkStrikesDocketEntry.test.js
npm run test:file web-client/integration-tests/docketClerkViewsAPendingItem.test.js
npm run test:file web-client/integration-tests/externalUserViewsLegacySealedDocuments.test.js
npm run test:file web-client/integration-tests/messagesJourney.test.js
npm run test:file web-client/integration-tests/docketClerkViewsAPendingItem.test.js
npm run test:file web-client/integration-tests/noticeOfChangeOfAddressQCJourney.test.js
# ^ Run results, started by docker system prune then: 
# 1. Pass, 0ms for both calls to practitionerUpdatesAddress
# 2. Pass, 0 ms, then 6000ms
# 3. Pass, 0 ms, then 6000ms again

# todo: run this group alone to be more like a circle ci container running in parallel 
# also todo: wait for the page to be correct before moving on
# this is all the tests that might run alongside noticeOfTrialSessionWithElectronicService, note ELECTRONIC
# example: https://app.circleci.com/pipelines/github/flexion/ef-cms/34487/workflows/8f3528fd-e599-4f21-b610-5f02fe54936f/jobs/217017/parallel-runs/0?filterBy=ALL
# npm run test:file web-client/integration-tests/admissionsClerkCreatesUserForCase.test.js
# npm run test:file web-client/integration-tests/caseFromPaperDocumentScan.test.js
# npm run test:file web-client/integration-tests/correspondenceJourney.test.js
# npm run test:file web-client/integration-tests/docketClerkConsolidatesCases.test.js
# npm run test:file web-client/integration-tests/docketClerkEditsPetitionPaymentFee.test.js
# npm run test:file web-client/integration-tests/docketClerkSealsCase.test.js
# npm run test:file web-client/integration-tests/docketClerkUnsealsCase.test.js
# npm run test:file web-client/integration-tests/docketClerkViewsTrialSessionTabs.test.js
# npm run test:file web-client/integration-tests/externalUserViewsOpenAndClosedCases.test.js
# npm run test:file web-client/integration-tests/migrateLegacyCaseReadyForTrial.test.js
# npm run test:file web-client/integration-tests/noticeOfTrialSessionWithElectronicService.test.js
# npm run test:file web-client/integration-tests/orderSearchJourneySpecialCharacters.test.js
# npm run test:file web-client/integration-tests/petitionsClerkCaseJourney.test.js
# npm run test:file web-client/integration-tests/petitionsClerkEditsPetitionPaymentFee.test.js
# npm run test:file web-client/integration-tests/petitionsClerkServesOrder.test.js
# npm run test:file web-client/integration-tests/privatePractitionerConsolidatedCasesWithStatisticsJourney.test.js
# npm run test:file web-client/integration-tests/trialClerkWorkingCopy.test.js
# npm run test:file web-client/integration-tests/noticeOfTrialSessionWithPaperService.test.js

# todo: run this group alone to be more like a circle ci container running in parallel 
# this is all the tests that might run alongside noticeOfTrialSessionWithPaperService, note PAPER
# example: https://app.circleci.com/pipelines/github/ustaxcourt/ef-cms/3279/workflows/f915f318-811e-4176-9a50-91d0a0a31ac8/jobs/33207
# npm run test:file web-client/integration-tests/admissionsClerkModifiesPetitionerAddressAndEmail.test.js
# npm run test:file web-client/integration-tests/caseJourney.test.js
# npm run test:file web-client/integration-tests/docketClerkAddsAutomaticBlockCaseToTrial.test.js
# npm run test:file web-client/integration-tests/docketClerkCreatesATrial.test.js
# npm run test:file web-client/integration-tests/docketClerkEditsPetitionerInformation.test.js
# npm run test:file web-client/integration-tests/docketClerkSealsCaseContactInformation.test.js
# npm run test:file web-client/integration-tests/docketClerkUpdateCaseJourney.test.js
# npm run test:file web-client/integration-tests/docketRecordJourney.test.js
# npm run test:file web-client/integration-tests/docketRecordJourney.test.js
# npm run test:file web-client/integration-tests/misc.test.js
# npm run test:file web-client/integration-tests/noticeOfTrialSessionWithPaperService.test.js



# jk, this isn't splitting them into parallel runs like is happening in circle, so won't reflect
# what we're looking for, will be way too many cases
# npm run test:client:integration:ci

