import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/practitioners/upsertPractitionerRecord',
  () => mockFactory('upsertPractitionerRecord'),
);
