import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber', () =>
  mockFactory('getCaseByDocketNumberPostgres'),
);

jest.mock('@web-api/persistence/postgres/cases/upsertCase', () =>
  mockFactory('upsertCase'),
);

jest.mock('@web-api/persistence/postgres/cases/upsertCases', () =>
  mockFactory('upsertCases'),
);
