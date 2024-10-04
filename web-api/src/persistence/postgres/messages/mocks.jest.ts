import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/messages/createMessage', () =>
  mockFactory('createMessage'),
);

jest.mock(
  '@web-api/persistence/postgres/messages/getCompletedSectionInboxMessages',
  () => mockFactory('getCompletedSectionInboxMessages'),
);

jest.mock(
  '@web-api/persistence/postgres/messages/getCompletedUserInboxMessages',
  () => mockFactory('getCompletedUserInboxMessages'),
);

jest.mock('@web-api/persistence/postgres/messages/getMessageById', () =>
  mockFactory('getMessageById'),
);

jest.mock(
  '@web-api/persistence/postgres/messages/getMessagesByDocketNumber',
  () => mockFactory('getMessagesByDocketNumber'),
);

jest.mock(
  '@web-api/persistence/postgres/messages/getMessageThreadByParentId',
  () => mockFactory('getMessageThreadByParentId'),
);

jest.mock(
  '@web-api/persistence/postgres/messages/getSectionInboxMessages',
  () => mockFactory('getSectionInboxMessages'),
);

jest.mock(
  '@web-api/persistence/postgres/messages/getSectionOutboxMessages',
  () => mockFactory('getSectionOutboxMessages'),
);

jest.mock('@web-api/persistence/postgres/messages/getUserInboxMessages', () =>
  mockFactory('getUserInboxMessages'),
);

jest.mock('@web-api/persistence/postgres/messages/getUserOutboxMessages', () =>
  mockFactory('getUserOutboxMessages'),
);

jest.mock(
  '@web-api/persistence/postgres/messages/markMessageThreadRepliedTo',
  () => mockFactory('markMessageThreadRepliedTo'),
);

jest.mock('@web-api/persistence/postgres/messages/setMessageAsRead', () =>
  mockFactory('setMessageAsRead'),
);

jest.mock('@web-api/persistence/postgres/messages/updateMessage', () =>
  mockFactory('updateMessage'),
);

jest.mock('@web-api/persistence/postgres/messages/upsertMessages', () =>
  mockFactory('upsertMessages'),
);
