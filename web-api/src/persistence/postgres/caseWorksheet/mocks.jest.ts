import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/caseWorkSheet/getCaseWorksheetsByDocketNumber',
  () => mockFactory('getCaseWorksheetsByDocketNumber'),
);

jest.mock(
  '@web-api/persistence/postgres/caseWorkSheet/upsertCaseWorksheet',
  () => mockFactory('upsertCaseWorksheet'),
);
