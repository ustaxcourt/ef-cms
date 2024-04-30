import {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  PARTY_TYPES,
  ROLES,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { completeWorkItemInteractor } from './completeWorkItemInteractor';

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

  it('should update the docket entry work item if it matches the completed work item id', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        docketEntries: [
          {
            ...MOCK_CASE.docketEntries[0],
            workItem: {
              associatedJudge: 'Chief Judge',
              docketEntry: {
                createdAt: '2021-06-07T20:28:16.020Z',
                docketEntryId: '25100ec6-eeeb-4e88-872f-c99fad1fe6c7',
                documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
                documentType: 'Order of Dismissal for Lack of Jurisdiction',
                eventCode: 'ODJ',
                isFileAttached: true,
                receivedAt: '2021-06-07T04:00:00.000Z',
                userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
              },
              docketNumber: '310-21',
              entityName: 'WorkItem',
              section: 'docket',
              sentBy: 'Test Docketclerk',
              updatedAt: '2021-06-07T20:28:16.124Z',
              workItemId: mockWorkItem.workItemId,
            },
          },
        ],
      });

    await completeWorkItemInteractor(applicationContext, {
      completedMessage: 'Completed',
      workItemId: mockWorkItem.workItemId,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          workItem: expect.objectContaining({
            docketNumber: mockWorkItem.docketNumber,
            workItemId: mockWorkItem.workItemId,
          }),
        }),
      ]),
    );
  });
});
