# 10495 Development Notes

## Todo Items

All TODO comments begin with the string "10495 TODO:" to help keep track of them.

- [ ] Replace magic 'User' strings with a static constant in `User.ts`
- [ ] `getPractitionerByBarNumber.ts` should map results to the Practitioner entity
- [ ] Do we need `pickFields` in `mapper.ts`?
- [ ] Where should Practitioner entity-specific fields like `suffix` and `additionalPhone` live?
- [ ] Fix privatePractitioner representing field

## Dynamo Functions to Postgres

- [x] createNewPetitionerUser
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

## Notes on User entity hierarchy

```shell
User
  ├── Practitioner
  ├── PrivatePractitioner
  └── IrsPractitioner
```

Practitioner
- optional additionalPhone?: string;
- required admissionsDate: string;
- required admissionsStatus: string;
- required barNumber: string;
- required birthYear: string;
- optional confirmEmail?: string;
- required practiceType: string;
- optional firmName?: string;
- required firstName: string;
- required lastName: string;
- optional middleName?: string;
- required originalBarState: string;
- optional practitionerNotes?: string;
- required practitionerType: string;
- required serviceIndicator: string;
- optional suffix?: string;
- optional updatedEmail?: string;

PrivatePractitioner
- required entityName: string;
- required barNumber: string;
- required firmName: string;
- required representing: string[];
- required serviceIndicator: string;

IrsPractitioner
- required barNumber: string;
- required serviceIndicator: string;

## No longer relevant
- `createNewPetitionerUser.ts` contains two distinct operations that can fail independently and they could before this migration, and that's okay.
