const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  getDocumentQCInboxForUserInteractor,
} = require('./getDocumentQCInboxForUserInteractor');

describe('getDocumentQCInboxForUserInteractor', () => {
  let mockWorkItem = {
    createdAt: '',
    docketEntry: {
      sentBy: 'petitioner',
    },
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    messages: [],
    section: DOCKET_SECTION,
    sentBy: 'docketclerk',
  };

  it('throws an error if the user does not have access to the work item', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext.getPersistenceGateway().getDocumentQCServedForSection =
      async () => mockWorkItem;

    let error;
    try {
      await getDocumentQCInboxForUserInteractor(applicationContext, {
        userId: '123',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });

  it('fetches the authorized user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    await getDocumentQCInboxForUserInteractor(applicationContext, {
      userId: 'docketClerk',
    });

    expect(
      applicationContext.getPersistenceGateway().getUserById.mock.calls[0][0]
        .userId,
    ).toEqual('docketClerk');
  });

  it('queries workItems for the given userId', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    });

    await getDocumentQCInboxForUserInteractor(applicationContext, {
      userId: 'docketClerk',
    });

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCInboxForUser.mock
        .calls[0][0].userId,
    ).toEqual('docketClerk');
  });

  it('filters the returned workItems for the given user', async () => {
    const workItem = {
      assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
      assigneeName: 'bob',
      caseStatus: 'New',
      caseTitle: 'Johnny Joe Jacobson',
      docketEntry: {},
      docketNumber: '101-18',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      section: DOCKET_SECTION,
      sentBy: 'bob',
    };

    const mockUser = {
      role: ROLES.docketClerk,
      userId: 'docketClerk',
    };

    applicationContext.getCurrentUser.mockReturnValue(mockUser);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockUser);

    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([workItem]);

    applicationContext
      .getUtilities()
      .filterWorkItemsForUser.mockImplementation(({ workItems }) => workItems);

    await getDocumentQCInboxForUserInteractor(applicationContext, {
      userId: 'docketClerk',
    });

    expect(
      applicationContext.getUtilities().filterWorkItemsForUser.mock.calls[0][0],
    ).toEqual({
      user: mockUser,
      workItems: [workItem],
    });
  });
});
