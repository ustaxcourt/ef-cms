import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/cases/upsertCase', () =>
  mockFactory('upsertCase'),
);
