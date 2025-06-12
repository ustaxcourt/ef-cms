import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/utils/operation/tryGetLocks', () =>
  mockFactory('tryGetLocks', [{ successfullyLocked: true, identifier: 'abc' }]),
);
