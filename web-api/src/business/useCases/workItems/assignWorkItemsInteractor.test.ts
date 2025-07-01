import '@web-api/persistence/postgres/workitems/mocks.jest';
import { DOCKET_SECTION } from '../../../../../shared/src/business/entities/EntityConstants';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { assignWorkItemsInteractor } from './assignWorkItemsInteractor';
import { caseServicesSupervisorUser } from '../../../../../shared/src/test/mockUsers';
import { getWorkItemById as getWorkItemByIdMock } from '@web-api/persistence/postgres/workitems/getWorkItemById';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { upsertWorkItems as upsertWorkItemsMock } from '@web-api/persistence/postgres/workitems/upsertWorkItems';

describe('assignWorkItemsInteractor', () => {
  const upsertWorkItems = upsertWorkItemsMock as jest.Mock;
  const getWorkItemById = getWorkItemByIdMock as jest.Mock;

  const options = { assigneeId: 'ss', assigneeName: 'ss', workItemId: '' };
  let mockWorkItem: RawWorkItem;

  beforeEach(() => {
    mockWorkItem = {
      assigneeId: '03b74100-10ac-45f1-865d-b063978cac9c',
      assigneeName: 'bob',
      createdAt: '2018-12-27T18:06:02.971Z',
      docketEntryId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
      docketNumber: '101-18',
      section: DOCKET_SECTION,
      sentBy: 'irsPractitioner',
      updatedAt: '2018-12-27T18:06:02.968Z',
      workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
    };

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockDocketClerkUser,
      section: DOCKET_SECTION,
    });

    getWorkItemById.mockResolvedValue(new WorkItem(mockWorkItem));
  });

  it('should throw an unauthorized error when the user does not have permission to assign work items', async () => {
    await expect(
      assignWorkItemsInteractor(
        applicationContext,
        options,
        mockDocketClerkUser,
      ),
    ).rejects.toThrow();
  });

  it('should throw an error when the work item is invalid', async () => {
    getWorkItemById.mockReturnValue(
      new WorkItem({
        ...mockWorkItem,
        docketNumber: undefined,
      }),
    );

    await expect(
      assignWorkItemsInteractor(
        applicationContext,
        options,
        mockDocketClerkUser,
      ),
    ).rejects.toThrow();
  });

  it('should throw an error when not given work item or work item id', async () => {
    await expect(
      assignWorkItemsInteractor(
        applicationContext,
        {
          assigneeId: mockDocketClerkUser.userId,
          assigneeName: 'Ted Docket',
          workItem: undefined,
          workItemId: undefined,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow();
  });

  it('should assign work item to current user when given work item', async () => {
    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockDocketClerkUser.userId,
        assigneeName: 'Ted Docket',
        workItem: mockWorkItem,
        workItemId: undefined,
      },
      mockDocketClerkUser,
    );
    await expect(upsertWorkItems.mock.calls[0][0].workItems).toMatchObject([
      {
        section: DOCKET_SECTION,
        sentBy: mockDocketClerkUser.name,
        sentBySection: DOCKET_SECTION,
        sentByUserId: mockDocketClerkUser.userId,
      },
    ]);
  });

  it('assigns a work item to the current user', async () => {
    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockDocketClerkUser.userId,
        assigneeName: 'Ted Docket',
        workItemId: mockWorkItem.workItemId,
      },
      mockDocketClerkUser,
    );

    expect(upsertWorkItems.mock.calls[0][0].workItems).toMatchObject([
      {
        section: DOCKET_SECTION,
        sentBy: mockDocketClerkUser.name,
        sentBySection: DOCKET_SECTION,
        sentByUserId: mockDocketClerkUser.userId,
      },
    ]);
  });

  it('assigns a work item to a user with their original section value when the person making the assignment is a case services user', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValueOnce(caseServicesSupervisorUser)
      .mockReturnValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      });

    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockDocketClerkUser.userId,
        assigneeName: 'Ted Docket',
        workItemId: mockWorkItem.workItemId,
      },
      mockDocketClerkUser,
    );

    expect(upsertWorkItems.mock.calls[0][0].workItems).toMatchObject([
      {
        section: DOCKET_SECTION,
        sentBy: caseServicesSupervisorUser.name,
        sentBySection: caseServicesSupervisorUser.section,
        sentByUserId: caseServicesSupervisorUser.userId,
      },
    ]);
  });
});
