import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber', () =>
  mockFactory('getCaseByDocketNumber'),
);

jest.mock('@web-api/persistence/postgres/cases/upsertCases', () =>
  mockFactory('upsertCases'),
);

jest.mock('@web-api/persistence/postgres/cases/createCase', () =>
  mockFactory('createCase'),
);

jest.mock('@web-api/persistence/postgres/cases/updateCase', () =>
  mockFactory('updateCase'),
);

jest.mock('@web-api/persistence/postgres/cases/generateDocketNumber', () =>
  mockFactory('generateDocketNumber'),
);
