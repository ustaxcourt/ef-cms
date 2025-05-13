import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/users/createNewPetitionerUser', () =>
  mockFactory('createNewPetitionerUser'),
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

jest.mock('@web-api/persistence/postgres/users/deleteUserRecord', () =>
  mockFactory('deleteUserRecord'),
);

jest.mock(
  '@web-api/persistence/postgres/users/generateUserConfirmationCode',
  () => mockFactory('generateUserConfirmationCode'),
);

jest.mock('@web-api/persistence/postgres/users/getAllUsersByRole', () =>
  mockFactory('getAllUsersByRole'),
);

jest.mock('@web-api/persistence/postgres/users/getInternalUsers', () =>
  mockFactory('getInternalUsers'),
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

jest.mock(
  '@web-api/persistence/postgres/users/getUserByIdWithPractitioner',
  () => mockFactory('getUserByIdWithPractitioner'),
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
  '@web-api/persistence/postgres/users/refreshUserConfirmationCodeExpiration',
  () => mockFactory('refreshUserConfirmationCodeExpiration'),
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

jest.mock('@web-api/persistence/postgres/users/cases/getCasesForUser', () => ({
  getDocketNumbersByUser: jest.fn(),
  getCasesForUser: jest.fn(),
}));
