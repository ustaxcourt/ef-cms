import { mockFactory } from '@shared/test/mockFactory';

jest.mock(
  '@web-api/persistence/postgres/correspondence/getCaseCorrespondenceByDocketNumber',
  () => mockFactory('getCaseCorrespondenceByDocketNumber'),
);

jest.mock(
  '@web-api/persistence/postgres/correspondence/upsertCaseCorrespondence',
  () => mockFactory('upsertCaseCorrespondence'),
);
