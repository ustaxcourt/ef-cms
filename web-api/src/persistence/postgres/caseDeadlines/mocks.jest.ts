import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadline',
  () => mockFactory('upsertCaseDeadline'),
);

jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/deleteCaseDeadline',
  () => mockFactory('deleteCaseDeadline'),
);

jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDateRange',
  () => mockFactory('getCaseDeadlinesByDateRange', []),
);

jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber',
  () => mockFactory('getCaseDeadlinesByDocketNumber', []),
);
