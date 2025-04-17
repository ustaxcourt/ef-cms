import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/practitioners/createPractitionerRecord',
  () => mockFactory('createPractitionerRecord'),
);
