# 10495 Development Notes

## Todo Items

All TODO comments begin with the string "10495 TODO:" to help keep track of them.

- [ ] Fix privatePractitioner `representing` field
- [ ] Expire user confirmation codes (some sort of cron job?)
- [ ] Replace all calls to `updateUserRecords` with `updateUser`
- [ ] Remove `getUserGateway` entirely
- [ ] Update & Create Case Associations Judge Updates, maybe??
- [ ] Odd case related functions
- [-] Implement OpenSearch sync (for example, searching for a pract by bar number in Case Information > Parties is broken)
- [-] Upsert Users from DynamoDB into Postgres (dynamoDB stream + process records)
- [-] Remove DynamoDB seed user when finished
- [ ] Implement TTL on Confirmation Codes
- [ ] Make sure all user related entities are copied in & all user related functions
- [ ] Update DynamoDB DrawIO Entity Map
- [ ] Update ERD for new tables
- [ ] Get Green PR and All Tests Pass
- [ ] Push to Experimental Environment (Smoke Tests)
- [ ] Write a Deletion Script to Remove DynamoDB Records (One Time)
- [ ] Test Deletion Script on Deployed Environment
- [ ] Index all where clauses
- [ ] Determine if selectAll is necessary for User functions
- [ ] dwUsersOnCase: is it possible for the same user to be on the same case multiple times??
- [ ] Do we need to tackle: "pk": "chief-judge-name" ??
- [ ] Delete UserCase

## Dynamo Functions to Postgres

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

Odd dynamo functions:

- associateUserWithCase - association table
- [ ] getCasesForUser - not really concerning users
- [ ] barNumberGenerator: Contains business logic for generating a bar number,
does not belong in the persistence layer.
- [ ] getUsersBySearchKey: Invoked by (1) `getPrivatePractitionersBySearchKey`
action, interactor and (2) `getIrsPractitionersBySearchKey` action, interactor.
Is "search key" a concept we need to hold onto?
- [ ] removePractitionerOnCase
- [ ] updatePractitionerOnCase

## Completed todos and no-longer-relevant notes
- [x] Replace magic 'User' strings with a static constant in `User.ts`
- [x] `getPractitionerByBarNumber.ts` should map results to the Practitioner entity
- [x] Do we need `pickFields` in `mapper.ts`?
- [x] Where should Practitioner entity-specific fields like `suffix` and `additionalPhone` live?
- `createNewPetitionerUser.ts` contains two distinct operations that can fail independently and they could before this migration, and that's okay.

## Things to test
- ./scripts/user/update-judge.ts
- Account Creation and Various Authentication States (such as forgot password, change email, grant e-access, etc)


## Considerations
- `userType`, which is the renamed `entityName` field, appears to only have `'User` or `'Practitioner'`

## OpenSearch/Dynamodb sync record for testing

```javascript
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
- [ ] deleteUserFromCase
