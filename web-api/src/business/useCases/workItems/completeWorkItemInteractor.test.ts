import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import {
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { completeWorkItemInteractor } from './completeWorkItemInteractor';
import { getWorkItemsByIds as getWorkItemsByIdsMock } from '@web-api/persistence/postgres/workitems/getWorkItemsByIds';
import { upsertWorkItems as upsertWorkItemsMock } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('completeWorkItemInteractor', () => {
  const getWorkItemById = getWorkItemsByIdsMock as jest.Mock;
  const upsertWorkItems = upsertWorkItemsMock as jest.Mock;
  const mockWorkItem = {
    assigneeId: applicationContext.getUniqueId(),
    createdAt: '2019-03-11T21:56:01.625Z',
    docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    docketNumber: '101-18',
    docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
    messages: [],
    section: DOCKET_SECTION,
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  beforeEach(() => {
    getWorkItemById.mockResolvedValue(new WorkItem(mockWorkItem));
    upsertWorkItems.mockResolvedValue(undefined);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);
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

    expect(getWorkItemById.mock.calls[1][0]).toMatchObject({
      workItemId: mockWorkItemId,
    });
  });

  it('should throw an error when the work item is not found', async () => {
    const mockWorkItemId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';
    getWorkItemById.mockResolvedValue(undefined);

    await expect(
      completeWorkItemInteractor(
        applicationContext,
        {
          completedMessage: 'Completed',
          workItemId: mockWorkItemId,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('was not found');
  });

  it('should complete the work item with the provided message', async () => {
    const mockWorkItemId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';
    const completedMessage = 'Work item has been completed';

    const result = await completeWorkItemInteractor(
      applicationContext,
      {
        completedMessage,
        workItemId: mockWorkItemId,
      },
      mockDocketClerkUser,
    );

    expect(result).toBeDefined();
    expect(result.completedMessage).toBe(completedMessage);
    expect(result.completedBy).toBe(mockDocketClerkUser.name);
    expect(result.completedByUserId).toBe(mockDocketClerkUser.userId);
    expect(result.completedAt).toBeDefined();
  });

  it('should call upsertWorkItems with the completed work item', async () => {
    const mockWorkItemId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    await completeWorkItemInteractor(
      applicationContext,
      {
        completedMessage: 'Completed',
        workItemId: mockWorkItemId,
      },
      mockDocketClerkUser,
    );

    expect(upsertWorkItems).toHaveBeenCalled();
    expect(upsertWorkItems.mock.calls[0][0].workItems).toHaveLength(1);
    expect(upsertWorkItems.mock.calls[0][0].workItems[0].workItemId).toBe(
      mockWorkItemId,
    );
  });

  it('should return the completed work item', async () => {
    const mockWorkItemId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    const result = await completeWorkItemInteractor(
      applicationContext,
      {
        completedMessage: 'Completed successfully',
        workItemId: mockWorkItemId,
      },
      mockDocketClerkUser,
    );

    expect(result).toBeDefined();
    expect(result.workItemId).toBe(mockWorkItemId);
    expect(result.docketNumber).toBe(mockWorkItem.docketNumber);
    expect(result.completedMessage).toBe('Completed successfully');
  });
});
