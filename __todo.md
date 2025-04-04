# 10495 Todo Items

## Dynamo Functions to Postgres

- [ ] createNewPetitionerUsers
- [ ] createNewPractitionerUser
- [ ] createOrUpdatePractitionerUser
- [ ] createPetitionerUserRecords
- [ ] createUserRecords
- [ ] generateAccountConfirmation
- [ ] getAccountConfirmationCode
- [ ] getCasesForUser
- [x] getInternalUsers
- [x]* getPractitionerByBarNumber
- [x] getUserByEmail
- [x] getUserById
- [x] getUserByIdOnceAllUpdatesComplete
- [x] getUsersById
- [x] getUsersInSection
- [x] updateUser & persistUser (same thing)
- [ ] refreshConfirmationCodeExpiration
- [ ] updatePractitionerUser
- [ ] updateUserRecords

Odd dynamo functions:

- [ ] barNumberGenerator: Contains business logic for generating a bar number,
does not belong in the persistence layer.
- [ ] getUsersBySearchKey: Invoked by (1) `getPrivatePractitionersBySearchKey`
action, interactor and (2) `getIrsPractitionersBySearchKey` action, interactor.
Is "search key" a concept we need to hold onto?
