import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { completeWorkItemInteractor } from './completeWorkItemInteractor';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('completeWorkItemInteractor', () => {
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
    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockResolvedValue(mockWorkItem);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);
  });

  it('should throw an error when the user does not have permission to complete the work item', async () => {
    await expect(
      completeWorkItemInteractor(
        applicationContext,
        {
          completedMessage: 'Completed',
          workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized for complete workItem');
  });

  it('should retrieve the original work item from persistence', async () => {
    const mockWorkItemId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    await completeWorkItemInteractor(
      applicationContext,
      {
        completedMessage: 'Completed',
        workItemId: mockWorkItemId,
      },
      mockDocketClerkUser,
    );

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

    await completeWorkItemInteractor(
      applicationContext,
      {
        completedMessage: 'Completed',
        workItemId: mockWorkItem.workItemId,
      },
      mockDocketClerkUser,
    );

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
