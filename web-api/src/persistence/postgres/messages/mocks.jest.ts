jest.mock('@web-api/persistence/postgres/messages/createMessage', () => ({
  createMessage: jest.fn(),
}));

jest.mock(
  '@web-api/persistence/postgres/messages/getCompletedSectionInboxMessages',
  () => ({
    getCompletedSectionInboxMessages: jest.fn(),
  }),
);

jest.mock(
  '@web-api/persistence/postgres/messages/getCompletedUserInboxMessages',
  () => ({
    getCompletedUserInboxMessages: jest.fn(),
  }),
);

jest.mock('@web-api/persistence/postgres/messages/getMessageById', () => ({
  getMessageById: jest.fn(),
}));

jest.mock('@web-api/persistence/postgres/messages/getMessagesByDocketNumber');

jest.mock(
  '@web-api/persistence/postgres/messages/getMessageThreadByParentId',
  () => ({
    getMessageThreadByParentId: jest.fn(() => console.error('not implemented')),
  }),
);

jest.mock(
  '@web-api/persistence/postgres/messages/getSectionInboxMessages',
  () => ({
    getSectionInboxMessages: jest.fn(),
  }),
);

jest.mock(
  '@web-api/persistence/postgres/messages/getSectionOutboxMessages',
  () => ({
    getSectionOutboxMessages: jest.fn(),
  }),
);

jest.mock(
  '@web-api/persistence/postgres/messages/getUserInboxMessages',
  () => ({
    getUserInboxMessages: jest.fn(),
  }),
);

jest.mock(
  '@web-api/persistence/postgres/messages/getUserOutboxMessages',
  () => ({
    getUserOutboxMessages: jest.fn(),
  }),
);

jest.mock(
  '@web-api/persistence/postgres/messages/markMessageThreadRepliedTo',
  () => ({
    markMessageThreadRepliedTo: jest.fn(),
  }),
);

jest.mock('@web-api/persistence/postgres/messages/setMessageAsRead', () => ({
  setMessageAsRead: jest.fn(),
}));

jest.mock('@web-api/persistence/postgres/messages/updateMessage', () => ({
  updateMessage: jest.fn(),
}));
