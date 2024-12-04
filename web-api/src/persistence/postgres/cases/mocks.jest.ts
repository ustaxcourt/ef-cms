import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/cases/createCase', () =>
  mockFactory('createCase'),
);

jest.mock('@web-api/persistence/postgres/cases/generateDocketNumber', () =>
  mockFactory('generateDocketNumber'),
);

jest.mock('@web-api/persistence/postgres/cases/getCaseByDocketNumber', () =>
  mockFactory('getCaseByDocketNumber'),
);

jest.mock(
  '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber',
  () => mockFactory('getCaseMetadataByDocketNumber'),
);

// jest.mock(
//   '@web-api/persistence/postgres/cases/getCasesByLeadDocketNumber',
//   () => mockFactory('getCasesByLeadDocketNumber'),
// );

jest.mock(
  '@web-api/persistence/postgres/cases/getCasesMetadataByDocketNumbers',
  () => mockFactory('getCasesMetadataByDocketNumbers'),
);

jest.mock('@web-api/persistence/postgres/cases/getConsolidatedCasesCount', () =>
  mockFactory('getConsolidatedCasesCount'),
);

jest.mock('@web-api/persistence/postgres/cases/updateCase', () =>
  mockFactory('updateCase'),
);

jest.mock('@web-api/persistence/postgres/cases/upsertCases', () =>
  mockFactory('upsertCases'),
);
