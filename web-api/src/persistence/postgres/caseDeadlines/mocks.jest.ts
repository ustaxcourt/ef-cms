import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/caseDeadlines/createCaseDeadline',
  () => mockFactory('createCaseDeadline'),
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
