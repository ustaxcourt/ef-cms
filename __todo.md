# 10495 Development Notes

## Todo part 1

All TODO comments begin with the string "10495 TODO:" to help keep track of them.

- [in-progress] Figure out how to store practitioners
  - [x] Fix privatePractitioner `representing` field
  - [x] Split Up Users and Practitioners (into separate directories + functions)
  - [x] Added EntityName to User and removed UserType References
  - [x] Added User Information Back into Petitioner (role, contact, name, etc)
  - [x] Check all user functions and ensure using User vs Practitioner where applicable
    - [x] getUserById
      - [x] getUserInteractor - add new function getUserOrPractitioner
      - [x] createCaseInteractor ditto
      - [x] deleteCounselFromCaseInteractor ditto
      - [x] check getUserByIdOnceAllUpdatesComplete
      - [x] SIDE QUEST: fix all invocations of web-api/src/business/useCaseHelper/caseAssociation/associateIrsPractitionerToCase.ts
    - [x] getUsersById
    - [x] getUsersInSection
    - [x] updatePractitionerUser
    - [x] updateUser
    - [x] upsertUsers
    - [x] updatePractitionerUser
    - [x] getPractitionerByBarNumber
    - [x] createUserRecord
    - [x] createOrUpdatePractitionerUser
    - [x] createNewPractitionerUser
  - [x] make sure any sure any situation expecting an IrsPractitioner or a PrivatePractitioner in the application/interactor layer gets what it needs from persistence
  - [x] finish implementing `practitionerEntity` function in `practitioner/mapper.ts`
- [X] Add entity name to User On Case (Practitioner On Case)
- [x] Update `web-api/src/lambdas/migration/utilities/getUserById.ts` (no longer necessary, removed)
- [x] Consider replicating the name field from User on Practitioner (need to be able to search for Practitioners by name)
- [x] dwUsersOnCase: is it possible for the same user to be on the same case multiple times?? (update the answer is no, it's not possible, but what we've built does handle this scenario)
- [x] Odd user-related dynamodb functions
- [x] Make sure all user related entities are copied in & all user related functions (i.e., scrub all user-related dynamodb code)
- [in-progress] Implement OpenSearch sync
  - [looks ok] `web-api/src/persistence/elasticsearch/getPractitionersByName.ts`
  - [looks ok] `web-api/src/persistence/elasticsearch/helpers/searchClauses.ts`
  - [x] `web-api/src/persistence/elasticsearch/getIndexNameForRecord.ts`
- [in-progress] Upsert Users from DynamoDB into Postgres (dynamoDB stream + process records)
- [x] barNumberGenerator: Contains business logic for generating a bar number,
does not belong in the persistence layer. -- Waiting on Jim Lerza to confirm business rules for generating bar numbers
- [x] Determine if selectAll is necessary for User functions (solo)
- [x] Update Mocks to include all functions (solo)
- [x] Index all where clauses (good for solo work)
- [x] Confirm Confirmation Codes Working as Expected
- [x] getCasesByEmailTotal, figure out what to do with this, will it all be in opensearch or postgres
- [x] Update updateUser/upsertUsers to always check for practitioner role and persist practitioner data if applicable
      - Make a single function(or close to one) function for updating user. Consolidate
- [x] Consider doing the same when fetching user data
- [x] resolve issue regarding joining userOnCase with practitioner since practitioners may be petitioners on a case
- [x] getCasesByDocketNumbers we need to think about efficiency
- [x] Do a performance pass
- [x] Implement TTL on Confirmation Codes
- [ ] Test Deletion Script on Deployed Environment
- [ ] Update ERD for new tables
- [ ] Do a full migration on local computer
- [ ] Need to consider that during the first migration we will not have the users in postgres so Opensearch sync will need to check both dynamo and postgres. aka indexOpenSearchUserOnCase -> getUserById will not work.
- [ ] modify disassociateUserFromCase to accept an array
- [ ] double check when a user is removed from a case, we also remove it from elasticsearch

## Odd dynamo functions that need to be reimplemented with postgres

- [x] associateUserWithCase - association table
- [x] getCasesForUser - not really concerning users
- [x] getUsersBySearchKey
- [x] removePractitionerOnCase
- [x] updatePractitionerOnCase
- [x] getPrivatePractitionersOnCase
- [x] getIrsPractitionerOnCase
- [x] getAllUsersByRole
- [x] getCasesByEmailTotal

## Things to test

- ./scripts/user/update-judge.ts
- Account Creation and Various Authentication States (such as forgot password, change email, grant e-access, etc)

## OpenSearch/Dynamodb sync record for testing

```json
{
  "role": "petitioner",
  "address2": "Blandtowne, AK 90210",
  "phone": "234-234-2345",
  "address1": "123 Domestic Bliss Lane",
  "entityName": "User",
  "name": "Test Petitioner OpenSearch",
  "sk": "user|e3e1941f-230a-47bb-80ec-6b561c1765cd",
  "section": "petitioner",
  "pk": "user|e3e1941f-230a-47bb-80ec-6b561c1765cd",
  "userId": "e3e1941f-230a-47bb-80ec-6b561c1765cd",
  "email": "petitionerOpenSearch@example.com"
}
```

## Association tables to replace 4/10/25

- [x] associateUserWithCase
- [x] associateUserWithPendingCase (this was combined with associateUserWithCase)
- [x] verifyCaseForUser
- [x] verifyPendingCaseForUser
- [x] deleteUserFromCase

## Dynamo functions reimplemented with postgres and swapped for dynamo implementations

- [x] createNewPetitionerUser
- [x] createNewPractitionerUser
- [x] createOrUpdatePractitionerUser
- [x] createPetitionerUserRecord (Note: removed 's' from function name)
- [x] createUserRecords
- [x] generateAccountConfirmationCode (Note: renamed to generateUserConfirmationCode)
- [x] getAccountConfirmationCode  (Note: renamed to getUserConfirmationCode)
- [x] refreshConfirmationCodeExpiration (Note: renamed to refreshUserConfirmationCodeExpiration)
- [x] getInternalUsers
- [x] getPractitionerByBarNumber
- [x] getUserByEmail
- [x] getUserById
- [x] getUserByIdOnceAllUpdatesComplete
- [x] getUsersById
- [x] getUsersInSection
- [x] updateUser & persistUser (same thing)
- [x] updatePractitionerUser

## Completed todos and no-longer-relevant notes
- [x] Replace magic 'User' strings with a static constant in `User.ts`
- [x] `getPractitionerByBarNumber.ts` should map results to the Practitioner entity
- [x] Do we need `pickFields` in `mapper.ts`?
- [x] Where should Practitioner entity-specific fields like `suffix` and `additionalPhone` live?
- `createNewPetitionerUser.ts` contains two distinct operations that can fail independently and they could before this migration, and that's okay.
- [x] Replace all calls to `updateUserRecords` with `updateUser`

## Random notes

case
4383-25
(in postgres)

petitioner (contact id/user id)
3e579a7e-4ae0-4b69-af1f-be4d261dd8f3
petitionerOnCase - in postgres -> dwPetitionerOnCase
userCase - in dynamodb -> dwUserOnCase
user - in dynamodb -> dwUser

practitioner
barNumber (PT1234)
userId 9bd27534-3c9f-471e-8b29-2461d08ffe12
(privatePractioner | irsPractitioner | inActivePractitioner - in dynamodb) -> dwPractitioner
(user - in dynamodb) -> dwUser
(userCase - in dynamodb) -> dwUserOnCase


respondent
irsPractitioner
barNumber: CS0478
202c6900-08bf-4dff-bd67-db58efee8e0b
user|202c6900-08bf-4dff-bd67-db58efee8e0b
irsPractioner|202c6900-08bf-4dff-bd67-db58efee8e0b
userCase -- in dynamodb

pk: practioner|id
sk: document|id

## Questions

How does the tax court...
1) add a practitioner without a user account? - answer: not allowed (but support legacy w/o email)
2) add a practitioner to the system? - answer: admissions clerk only under advanced search



# Rivas (private practitioner)
Needs to be removed from dynamodb seed data (it was re-added during work on opensearch sync) and re-added to postgres seed data and the users json file here:
web-api/storage/fixtures/seed/users.json

```json
  {
    "admissionsStatus": "Active",
    "lastName": "Rivas",
    "role": "privatePractitioner",
    "admissionsDate": "2019-03-01",
    "section": "privatePractitioner",
    "practitionerType": "Attorney",
    "userId": "29e9b4d1-63bc-4f66-b230-59a3a9ae44eb",
    "practiceType": "Private",
    "firstName": "Alden",
    "serviceIndicator": "Electronic",
    "barNumber": "RA3333",
    "birthYear": "1950",
    "entityName": "Practitioner",
    "contact": {
      "address3": "Under the stairs",
      "address2": "Apartment 4",
      "city": "Chicago",
      "phone": "+1 (555) 555-5555",
      "address1": "234 Main St",
      "postalCode": "61234",
      "state": "IL",
      "countryType": "domestic"
    },
    "sk": "user|29e9b4d1-63bc-4f66-b230-59a3a9ae44eb",
    "name": "Alden Rivas",
    "firmName": "Law Offices of Rivas and Kathy Gee",
    "pk": "user|29e9b4d1-63bc-4f66-b230-59a3a9ae44eb",
    "originalBarState": "FL",
    "email": "privatePractitioner4@example.com"
  },
  {
    "sk": "user|29e9b4d1-63bc-4f66-b230-59a3a9ae44eb",
    "pk": "privatePractitioner|Alden Rivas"
  },
  {
    "sk": "user|29e9b4d1-63bc-4f66-b230-59a3a9ae44eb",
    "pk": "privatePractitioner|ALDEN RIVAS"
  },
  {
    "sk": "user|29e9b4d1-63bc-4f66-b230-59a3a9ae44eb",
    "pk": "privatePractitioner|RA3333"
  },
```

Current flow:
efcms-local -> DynamoDB -> partition -> processSteam -> process???Entity -> Opensearch

Ideal flow:
efcms-local -> DynamoDB -> partition -> processSteam -> [processUserEntity] -> Postgres ->
if user table
-> Send Message to SQS -> Indexing in Openseach (base)
if practioner table
-> Send Message to SQS -> Indexing in Openseach (practitioner)

DynamoDB:

pk: user|
sk: user|
entityName: User|Practitioner



pk: user|{userId}
sk: pending-case|{docketNumber}

process User on Case
pk: user|
sk: case|

process Practitioner on Case (Process Practitioner Mapping)
"pk": "case|101-21",
"sk": "irsPractitioner|5805d1ab-18d0-43ec-bafb-654e83405416",

"pk": "case|101-21",
"sk": "privatePractitioner|5805d1ab-18d0-43ec-bafb-654e83405416",


---------------------------------------------------------------------
??? Records Mappings
pk: privatePractitioner|UPPER_NAME
sk: user|

pk: privatePractitioner|LOWER_NAME
sk: user|

pk: privatePractitioner|BAR_NUMBER
sk: user|

Opensearch:
efcms-user

Assuming User -> OtherRecords
if yes, then we need partition out the user records into processUserEntity

if no, we then where are we processing user records??

---

stream pieces

`web-api/src/business/useCases/processStreamRecords/processStreamRecordsInteractor.ts`
This interactor only deals with dynamodb records: its purpose is to populate postgres.


## Failing Tests

Cypress:
- advancedSearch/practitioner-information
- myAccount/respondent-modifies-contact-info
-  advancedSearch/practitioner-search
- trialSession/trial-session-paper-pdf
- fileAPetitionUpdated/file-a-petition-generate-petition