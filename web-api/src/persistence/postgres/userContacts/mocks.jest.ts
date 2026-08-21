import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/userContacts/invalidateUserContactGeocode',
  () => mockFactory('invalidateUserContactGeocode'),
);

jest.mock('@web-api/persistence/postgres/userContacts/upsertUserContacts', () =>
  mockFactory('upsertUserContacts'),
);
