# 10495 Todo Items

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

All TODO comments begin with the string "10495 TODO:" to make searching for them
simple.

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
