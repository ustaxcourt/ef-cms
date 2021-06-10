const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const { completeWorkItemInteractor } = require('./completeWorkItemInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('completeWorkItemInteractor', () => {
  let mockUser;

  const mockWorkItem = {
    assigneeId: applicationContext.getUniqueId(),
    createdAt: '2019-03-11T21:56:01.625Z',
    docketEntry: {
      createdAt: '2019-03-11T21:56:01.625Z',
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
      documentType: 'Petition',
      entityName: 'DocketEntry',
      eventCode: 'P',
      filedBy: 'Lewis Dodgson',
      filingDate: '2019-03-11T21:56:01.625Z',
      isDraft: false,
      isMinuteEntry: false,
      isOnDocketRecord: true,
      sentBy: 'petitioner',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
    },
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    messages: [],
    section: DOCKET_SECTION,
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  beforeEach(() => {
    mockUser = {
      name: 'docket clerk',
      role: ROLES.docketClerk,
      userId: applicationContext.getUniqueId(),
    };

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);

    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue(mockWorkItem);

    applicationContext
      .getPersistenceGateway()
      .putWorkItemInOutbox.mockReturnValue({});

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    applicationContext
      .getPersistenceGateway()
      .getFullCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  it('should throw an error when the user does not have permission to complete the work item', async () => {
    mockUser = {
      name: PARTY_TYPES.petitioner,
      role: ROLES.petitioner,
      userId: 'petitioner',
    };

    await expect(
      completeWorkItemInteractor(applicationContext, {
        completedMessage: 'Completed',
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized for complete workItem');
  });

  it('should retrieve the original work item from persistence', async () => {
    const mockWorkItemId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    await completeWorkItemInteractor(applicationContext, {
      completedMessage: 'Completed',
      workItemId: mockWorkItemId,
    });

    expect(
      applicationContext.getPersistenceGateway().getWorkItemById.mock
        .calls[0][0],
    ).toMatchObject({ workItemId: mockWorkItemId });
  });
});
