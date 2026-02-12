import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/users/createBarNumber', () =>
  mockFactory('createBarNumber'),
);

jest.mock('@web-api/persistence/postgres/users/getDocketNumbersByUser', () => {
  return {
    ...mockFactory('getCasesForUser'),
    ...mockFactory('getDocketNumbersByUser'),
  };
});

jest.mock('@web-api/persistence/postgres/users/getUserById', () =>
  mockFactory('getUserById'),
);

jest.mock('@web-api/persistence/postgres/users/getUsersInSections', () =>
  mockFactory('getUsersInSections'),
);

jest.mock('@web-api/persistence/postgres/users/getUsersByRoles', () =>
  mockFactory('getUsersByRoles'),
);

jest.mock('@web-api/persistence/postgres/users/upsertPractitioner', () =>
  mockFactory('upsertPractitioner'),
);

jest.mock(
  '@web-api/persistence/postgres/users/getPractitionerByBarNumber',
  () => mockFactory('getPractitionerByBarNumber'),
);

jest.mock('@web-api/persistence/postgres/users/upsertUsers', () =>
  mockFactory('upsertUsers'),
);

jest.mock(
  '@web-api/persistence/postgres/users/getUserByIdOnceAllUpdatesComplete',
  () => mockFactory('getUserByIdOnceAllUpdatesComplete'),
);

jest.mock(
  '@web-api/persistence/postgres/users/getUserByPendingEmailVerificationToken',
  () => mockFactory('getUserByPendingEmailVerificationToken'),
);
