# 10495 Development Notes

## Todo part 1

All TODO comments begin with the string "10495 TODO:" to help keep track of them.

- [in-progress] Implement OpenSearch sync (for example, searching for a pract by bar number in Case Information > Parties is broken)
- [in-progress] Upsert Users from DynamoDB into Postgres (dynamoDB stream + process records)
- [ ] Fix privatePractitioner `representing` field
- [ ] Odd user-related dynamodb functions
- [ ] dwUsersOnCase: is it possible for the same user to be on the same case multiple times??
- [ ] Do we need to tackle: "pk": "chief-judge-name" ??
- [ ] Determine if selectAll is necessary for User functions
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
- [x] Delete `UserCase` entity
