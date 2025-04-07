# 10495 Development Notes

## Todo Items

All TODO comments begin with the string "10495 TODO:" to help keep track of them.

- [ ] Fix privatePractitioner `representing` field
- [ ] Expire user confirmation codes (some sort of cron job?)
- [ ] Replace all calls to `updateUserRecords` with `updateUser`

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
- [ ] getUserByEmail [pick up here on 4/8/25]
- [ ] getUserById
- [ ] getUserByIdOnceAllUpdatesComplete
- [ ] getUsersById
- [ ] getUsersInSection
- [ ] updateUser & persistUser (same thing)
- [ ] updatePractitionerUser

Odd dynamo functions:

- associateUserWithCase - association table
- [ ] getCasesForUser - not really concerning users
- [ ] barNumberGenerator: Contains business logic for generating a bar number,
does not belong in the persistence layer.
- [ ] getUsersBySearchKey: Invoked by (1) `getPrivatePractitionersBySearchKey`
action, interactor and (2) `getIrsPractitionersBySearchKey` action, interactor.
Is "search key" a concept we need to hold onto?

## Completed todos and no-longer-relevant notes
- [x] Replace magic 'User' strings with a static constant in `User.ts`
- [x] `getPractitionerByBarNumber.ts` should map results to the Practitioner entity
- [x] Do we need `pickFields` in `mapper.ts`?
- [x] Where should Practitioner entity-specific fields like `suffix` and `additionalPhone` live?
- `createNewPetitionerUser.ts` contains two distinct operations that can fail independently and they could before this migration, and that's okay.


## Considerations
- `userType`, which is the renamed `entityName` field, appears to only have `'User` or `'Practitioner'`