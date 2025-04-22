import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/caseCorrespondences/getCaseCorrespondenceByDocketNumber',
  () => mockFactory('getCaseCorrespondenceByDocketNumber', []),
);

jest.mock(
  '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences',
  () => mockFactory('upsertCaseCorrespondences'),
);
