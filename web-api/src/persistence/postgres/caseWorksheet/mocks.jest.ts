import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/caseWorksheet/getCaseWorksheetsByDocketNumber',
  () => mockFactory('getCaseWorksheetsByDocketNumber'),
);

jest.mock(
  '@web-api/persistence/postgres/caseWorksheet/upsertCaseWorksheets',
  () => mockFactory('upsertCaseWorksheets'),
);
