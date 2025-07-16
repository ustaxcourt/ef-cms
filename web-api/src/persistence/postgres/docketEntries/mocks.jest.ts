import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/docketEntries/upsertDocketEntries',
  () => mockFactory('upsertDocketEntries'),
);

jest.mock(
  '@web-api/persistence/postgres/docketEntries/reports/getAllPendingMotionDocketEntriesForJudge',
  () => mockFactory('getAllPendingMotionDocketEntriesForJudge'),
);
