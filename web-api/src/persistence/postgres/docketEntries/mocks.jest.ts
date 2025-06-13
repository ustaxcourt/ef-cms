import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/docketEntries/upsertDocketEntries',
  () => mockFactory('upsertDocketEntries'),
);

jest.mock(
  '@web-api/persistence/postgres/docketEntries/reports/getAllPendingMotionDocketEntriesForJudge',
  () => mockFactory('getAllPendingMotionDocketEntriesForJudge'),
);

jest.mock('@web-api/persistence/postgres/docketEntries/deleteDocketEntry', () =>
  mockFactory('deleteDocketEntry'),
);

jest.mock(
  '@web-api/persistence/postgres/docketEntries/updateDocketEntryPendingServiceStatus.ts',
  () => mockFactory('updateDocketEntryPendingServiceStatus'),
);

jest.mock(
  '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId',
  () => mockFactory('getDocketEntriesByDocketNumberAndDocketEntryId'),
);
