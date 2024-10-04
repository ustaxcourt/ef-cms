import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/workitems/deleteWorkItem', () =>
  mockFactory('deleteWorkItem'),
);

jest.mock(
  '@web-api/persistence/postgres/workitems/getDocumentQCInboxForSection',
  () => mockFactory('getDocumentQCInboxForSection'),
);

jest.mock(
  '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser',
  () => mockFactory('getDocumentQCInboxForUser'),
);

jest.mock(
  '@web-api/persistence/postgres/workitems/getDocumentQCServedForSection',
  () => mockFactory('getDocumentQCServedForSection'),
);

jest.mock(
  '@web-api/persistence/postgres/workitems/getDocumentQCServedForUser',
  () => mockFactory('getDocumentQCServedForUser'),
);

jest.mock('@web-api/persistence/postgres/workitems/getWorkItemById', () =>
  mockFactory('getWorkItemById'),
);

jest.mock(
  '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber',
  () => mockFactory('getWorkItemsByDocketNumber'),
);

jest.mock('@web-api/persistence/postgres/workitems/saveWorkItem', () =>
  mockFactory('saveWorkItem'),
);

jest.mock(
  '@web-api/persistence/postgres/workitems/setPriorityOnAllworkitems',
  () => mockFactory('setPriorityOnAllworkitems'),
);
