# 10495 Development Notes

## Todo part 1

All TODO comments begin with the string "10495 TODO:" to help keep track of them.

- [in-progress] Figure out how to store practitioners
  - [ ] Fix privatePractitioner `representing` field
  - [x] Split Up Users and Practitioners (into separate directories + functions)
  - [x] Added EntityName to User and removed UserType References
  - [x] Added User Information Back into Petitioner (role, contact, name, etc)
  - [ ] Check all user functions and ensure using User vs Practitioner where applicable
    - [x] getUserById
      - [x] getUserInteractor - add new function getUserOrPractitioner
      - [x] createCaseInteractor ditto
      - [x] deleteCounselFromCaseInteractor ditto
      - [x] check getUserByIdOnceAllUpdatesComplete
      - [x] SIDE QUEST: fix all invocations of web-api/src/business/useCaseHelper/caseAssociation/associateIrsPractitionerToCase.ts
    - [ ] getUserByIds
    - [ ] etc. ...
  - [ ] make sure any sure any situation expecting an IrsPractitioner or a PrivatePractitioner in the application/interactor layer gets what it needs from persistence
  - [ ] finish implementing `practitionerEntity` function in `practitioner/mapper.ts`
- [ ] Add entity name to Practitioner
- [ ] Update `web-api/src/lambdas/migration/utilities/getUserById.ts`
- [in-progress] Implement OpenSearch sync (for example, searching for a pract by bar number in Case Information > Parties is broken)
- [in-progress] Upsert Users from DynamoDB into Postgres (dynamoDB stream + process records)
- [x] Consider replicating the name field from User on Practitioner (need to be able to search for Practitioners by name)
- [ ] Odd user-related dynamodb functions
- [x] dwUsersOnCase: is it possible for the same user to be on the same case multiple times?? (update the answer is no, it's not possible, but what we've built does handle this scenario)
- [ ] Do we need to tackle: "pk": "chief-judge-name" ??
- [ ] Determine if selectAll is necessary for User functions
- [ ] Delete `UserCase` entity
- [ ] Make sure all user related entities are copied in & all user related functions (i.e., scrub all user-related dynamodb code)
- [ ] Index all where clauses (good for solo work)
- [ ] Implement TTL on Confirmation Codes (potentially solo work)
- [ ] Update api tests (Andy will tackle first half)
- [ ] Update shared tests (Kaitlyn will look at shared)
- [ ] Update legacy client integration tests (Kaitlyn will look at legacy client integration)
- [ ] Update cypress e2e tests (Andy will tackle first half)

## Todo part 2

- [ ] Get Green PR and All Tests Pass
- [ ] Push to Experimental Environment (Smoke Tests)
- [ ] Write a Deletion Script to Remove DynamoDB Records (One Time)
- [ ] Test Deletion Script on Deployed Environment
- [ ] Update DynamoDB DrawIO Entity Map
- [ ] Update ERD for new tables

## Odd dynamo functions that need to be reimplemented with postgres

- associateUserWithCase - association table
- [ ] getCasesForUser - not really concerning users
- [ ] barNumberGenerator: Contains business logic for generating a bar number,
does not belong in the persistence layer.
- [ ] getUsersBySearchKey: Invoked by (1) `getPrivatePractitionersBySearchKey`
action, interactor and (2) `getIrsPractitionersBySearchKey` action, interactor.
Is "search key" a concept we need to hold onto?
- [ ] removePractitionerOnCase
- [ ] updatePractitionerOnCase

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

questions

Tenille... how does the tax court...
1) add a practitioner without a user account? - not allowed (but support legacy w/o email)
2) add a practitioner to the system? - admissions clerk only under advanced search

  {
    "admissionsStatus": "Active",
    "lastName": "Practitioner",
    "role": "privatePractitioner",
    "admissionsDate": "2019-03-01",
    "section": "privatePractitioner",
    "practitionerType": "Attorney",
    "userId": "ad07b846-8933-4778-9fe2-b5d8ac8ad728",
    "practiceType": "Private",
    "firstName": "Test",
    "serviceIndicator": "Electronic",
    "barNumber": "PT5432",
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
    "sk": "user|ad07b846-8933-4778-9fe2-b5d8ac8ad728",
    "name": "Test Private Practitioner",
    "middleName": "Private",
    "firmName": "Bogus Barristers",
    "pk": "user|ad07b846-8933-4778-9fe2-b5d8ac8ad728",
    "originalBarState": "OR",
    "email": "privatePractitioner1@example.com"
  },


    {
    "role": "privatePractitioner",
    "representing": ["7805d1ab-18d0-43ec-bafb-654e83405416"],
    "section": "privatePractitioner",
    "representingPrimary": true,
    "userId": "ad07b846-8933-4778-9fe2-b5d8ac8ad728",
    "serviceIndicator": "Electronic",
    "barNumber": "PT5432",
    "entityName": "PrivatePractitioner",
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
    "name": "Test Private Practitioner",
    "sk": "privatePractitioner|ad07b846-8933-4778-9fe2-b5d8ac8ad728",
    "pk": "case|102-20",
    "email": "privatePractitioner1@example.com"
  },