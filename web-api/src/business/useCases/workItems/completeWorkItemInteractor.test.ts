import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { completeWorkItemInteractor } from './completeWorkItemInteractor';
import { getWorkItemById as getWorkItemByIdMock } from '@web-api/persistence/postgres/workitems/getWorkItemById';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('completeWorkItemInteractor', () => {
  const getWorkItemById = getWorkItemByIdMock as jest.Mock;
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
    getWorkItemById.mockResolvedValue(new WorkItem(mockWorkItem));

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

    expect(getWorkItemById.mock.calls[0][0]).toMatchObject({
      workItemId: mockWorkItemId,
    });
  });
});
