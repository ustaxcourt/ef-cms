import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/caseWorksheets/getCaseWorksheetsByDocketNumber',
  () => mockFactory('getCaseWorksheetsByDocketNumber'),
);

jest.mock(
  '@web-api/persistence/postgres/caseWorksheets/upsertCaseWorksheets',
  () => mockFactory('upsertCaseWorksheets'),
);
