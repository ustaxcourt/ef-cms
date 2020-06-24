const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getSentMessagesForUserInteractor,
} = require('./getSentMessagesForUserInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

describe('getSentMessagesForUserInteractor', () => {
  let user;

  const sentMessagesForUserMock = [
    {
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '101-18',
      docketNumberWithSuffix: '101-18S',
      document: { sentBy: 'petitioner' },
      isQC: false,
      messages: [],
      section: 'docket',
      sentBy: 'docketclerk',
    },
    {
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      docketNumber: '101-18',
      docketNumberWithSuffix: '101-18S',
      document: { sentBy: 'petitioner' },
      isQC: false,
      messages: [],
      section: 'docket',
      sentBy: 'docketclerk',
    },
  ];

  beforeEach(() => {
    user = {
      role: ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    };
    applicationContext.getCurrentUser.mockReturnValue(user);
  });

  it('throws an error if the user does not have access to the work item', async () => {
    user = {
      role: ROLES.petitioner,
      userId: 'petitioner',
    };
    applicationContext.getCurrentUser.mockReturnValue(user);
    applicationContext
      .getPersistenceGateway()
      .getSentMessagesForUser.mockRejectedValue(sentMessagesForUserMock);

    await expect(
      getSentMessagesForUserInteractor({
        applicationContext,
        section: 'docket',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('successfully returns the work item for a docketclerk', async () => {
    applicationContext
      .getPersistenceGateway()
      .getSentMessagesForUser.mockResolvedValue(sentMessagesForUserMock);
    const result = await getSentMessagesForUserInteractor({
      applicationContext,
      section: 'docket',
    });
    expect(result).toMatchObject(sentMessagesForUserMock);
  });
});
