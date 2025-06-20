import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/polling/getRequestResults', () =>
  mockFactory('getRequestResults'),
);

jest.mock('@web-api/persistence/postgres/polling/saveRequestResponse', () =>
  mockFactory('saveRequestResponse'),
);
