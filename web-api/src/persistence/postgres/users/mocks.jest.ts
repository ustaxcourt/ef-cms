import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/users/getPractitionerByBarNumber',
  () => mockFactory('getPractitionerByBarNumber'),
);

jest.mock('@web-api/persistence/postgres/users/updatePractitionerUser', () =>
  mockFactory('updatePractitionerUser'),
);

jest.mock('@web-api/persistence/postgres/users/createNewPractitionerUser', () =>
  mockFactory('createNewPractitionerUser'),
);

jest.mock('@web-api/persistence/postgres/users/updateUser', () =>
  mockFactory('updateUser'),
);
