const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  setWorkItemAsReadInteractor,
} = require('./setWorkItemAsReadInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');

describe('setWorkItemAsReadInteractor', () => {
  let user;

  const mockWorkItem = {
    assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
    assigneeName: 'bob',
    caseStatus: CASE_STATUS_TYPES.new,
    caseTitle: 'Johnny Joe Jacobson',
    docketEntry: MOCK_CASE.docketEntries[0],
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    section: DOCKET_SECTION,
    sentBy: 'bob',
    workItemId: '3bcca3a4-31df-4ab5-8a4c-b6110955ca5a',
  };

  beforeEach(() => {
    user = {
      role: ROLES.docketClerk,
      userId: 'docketclerk',
    };

    applicationContext.getCurrentUser.mockImplementation(() => user);

    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue(mockWorkItem);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        ...MOCK_CASE,
        docketEntries: [
          { ...MOCK_CASE.docketEntries[0], workItem: mockWorkItem },
        ],
      });
  });

  it('should throw an error when an unauthorized user tries to invoke this interactor', async () => {
    user = {
      userId: 'baduser',
    };

    await expect(
      setWorkItemAsReadInteractor(applicationContext, {
        workItemId: mockWorkItem.workItemId,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error when the docket entry is not found on the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue({
        ...mockWorkItem,
        docketEntry: { docketEntryId: 'ff54c9e8-93c5-4098-ba34-fa6edaa9da91' },
      });

    await expect(
      setWorkItemAsReadInteractor(applicationContext, {
        workItemId: mockWorkItem.workItemId,
      }),
    ).rejects.toThrow(NotFoundError);
  });

  it('should call updateDocketEntry with the docket entry work item marked as read', async () => {
    await setWorkItemAsReadInteractor(applicationContext, {
      workItemId: mockWorkItem.workItemId,
    });

    expect(
      applicationContext.getPersistenceGateway().updateDocketEntry.mock
        .calls[0][0],
    ).toMatchObject({
      document: { workItem: { isRead: true } },
    });
  });

  it('should call updateWorkItem with the work item marked as read', async () => {
    await setWorkItemAsReadInteractor(applicationContext, {
      workItemId: mockWorkItem.workItemId,
    });

    expect(
      applicationContext.getPersistenceGateway().updateWorkItem.mock
        .calls[0][0],
    ).toMatchObject({
      workItemToUpdate: { isRead: true },
    });
  });
});
