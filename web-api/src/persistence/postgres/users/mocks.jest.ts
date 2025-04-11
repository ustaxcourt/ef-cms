import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/users/createNewPetitionerUser', () =>
  mockFactory('createNewPetitionerUser'),
);

jest.mock('@web-api/persistence/postgres/users/createNewPractitionerUser', () =>
  mockFactory('createNewPractitionerUser'),
);

jest.mock(
  '@web-api/persistence/postgres/users/createOrUpdatePractitionerUser',
  () => mockFactory('createOrUpdatePractitionerUser'),
);

jest.mock(
  '@web-api/persistence/postgres/users/createPetitionerUserRecord',
  () => mockFactory('createPetitionerUserRecord'),
);

jest.mock('@web-api/persistence/postgres/users/createUserRecord', () =>
  mockFactory('createUserRecord'),
);

jest.mock(
  '@web-api/persistence/postgres/users/deleteUserConfirmationCode',
  () => mockFactory('deleteUserConfirmationCode'),
);

jest.mock('@web-api/persistence/postgres/users/getInternalUsers', () =>
  mockFactory('getInternalUsers'),
);

jest.mock(
  '@web-api/persistence/postgres/users/getPractitionerByBarNumber',
  () => mockFactory('getPractitionerByBarNumber'),
);

jest.mock('@web-api/persistence/postgres/users/getUserByEmail', () =>
  mockFactory('getUserByEmail'),
);

jest.mock('@web-api/persistence/postgres/users/getUserById', () =>
  mockFactory('getUserById'),
);

jest.mock(
  '@web-api/persistence/postgres/users/getUserByIdOnceAllUpdatesComplete',
  () => mockFactory('getUserByIdOnceAllUpdatesComplete'),
);

jest.mock('@web-api/persistence/postgres/users/getUserConfirmationCode', () =>
  mockFactory('getUserConfirmationCode'),
);

jest.mock('@web-api/persistence/postgres/users/getUsersById', () =>
  mockFactory('getUsersById'),
);

jest.mock('@web-api/persistence/postgres/users/getUsersInJudgeSection', () =>
  mockFactory('getUsersInJudgeSection'),
);

jest.mock('@web-api/persistence/postgres/users/getUsersInSection', () =>
  mockFactory('getUsersInSection'),
);

jest.mock(
  '@web-api/persistence/postgres/users/refreshConfirmationCodeExpiration',
  () => mockFactory('refreshConfirmationCodeExpiration'),
);

jest.mock('@web-api/persistence/postgres/users/updatePractitionerUser', () =>
  mockFactory('updatePractitionerUser'),
);

jest.mock('@web-api/persistence/postgres/users/updateUser', () =>
  mockFactory('updateUser'),
);

jest.mock('@web-api/persistence/postgres/users/upsertUsers', () =>
  mockFactory('upsertUsers'),
);

jest.mock(
  '@web-api/persistence/postgres/users/cases/associateUserWithCase',
  () => mockFactory('associateUserWithCase'),
);

jest.mock('@web-api/persistence/postgres/users/cases/deleteUserFromCase', () =>
  mockFactory('deleteUserFromCase'),
);

jest.mock('@web-api/persistence/postgres/users/cases/verifyCaseForUser', () =>
  mockFactory('verifyCaseForUser'),
);
