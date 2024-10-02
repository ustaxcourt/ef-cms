import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/workItems/deleteWorkItem', () =>
  mockFactory('deleteWorkItem'),
);

jest.mock(
  '@web-api/persistence/postgres/workItems/getDocumentQCInboxForSection',
  () => mockFactory('getDocumentQCInboxForSection'),
);

jest.mock(
  '@web-api/persistence/postgres/workItems/getDocumentQCInboxForUser',
  () => mockFactory('getDocumentQCInboxForUser'),
);

jest.mock(
  '@web-api/persistence/postgres/workItems/getDocumentQCServedForSection',
  () => mockFactory('getDocumentQCServedForSection'),
);

jest.mock(
  '@web-api/persistence/postgres/workItems/getDocumentQCServedForUser',
  () => mockFactory('getDocumentQCServedForUser'),
);

jest.mock('@web-api/persistence/postgres/workItems/getWorkItemById', () =>
  mockFactory('getWorkItemById'),
);

jest.mock(
  '@web-api/persistence/postgres/workItems/getWorkItemsByDocketNumber',
  () => mockFactory('getWorkItemsByDocketNumber'),
);

jest.mock('@web-api/persistence/postgres/workItems/saveWorkItem', () =>
  mockFactory('saveWorkItem'),
);

jest.mock(
  '@web-api/persistence/postgres/workItems/setPriorityOnAllWorkItems',
  () => mockFactory('setPriorityOnAllWorkItems'),
);
