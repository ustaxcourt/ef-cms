import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/utils/operation/tryGetLock', () =>
  mockFactory('tryGetLock'),
);

jest.mock('@web-api/persistence/postgres/utils/operation/releaseLock', () =>
  mockFactory('releaseLock'),
);
