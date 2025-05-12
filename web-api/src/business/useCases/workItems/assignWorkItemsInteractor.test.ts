import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from '@shared/business/entities/EntityConstants';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { assignWorkItemsInteractor } from './assignWorkItemsInteractor';
import { caseServicesSupervisorUser } from '@shared/test/mockUsers';
import { getWorkItemById as getWorkItemByIdMock } from '@web-api/persistence/postgres/workitems/getWorkItemById';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { upsertWorkItems as upsertWorkItemsMock } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';

describe('assignWorkItemsInteractor', () => {
  const upsertWorkItems = upsertWorkItemsMock as jest.Mock;
  const getWorkItemById = getWorkItemByIdMock as jest.Mock;
  const getUserById = getUserByIdMock as jest.Mock;

  const options = { assigneeId: 'ss', assigneeName: 'ss', workItemId: '' };
  let mockWorkItem;

  beforeEach(() => {
    mockWorkItem = {
      assigneeId: '03b74100-10ac-45f1-865d-b063978cac9c',
      assigneeName: 'bob',
      caseStatus: CASE_STATUS_TYPES.generalDocket,
      createdAt: '2018-12-27T18:06:02.971Z',
      docketEntry: {
        createdAt: '2018-12-27T18:06:02.968Z',
        docketEntryId: 'b6238482-5f0e-48a8-bb8e-da2957074a08',
        documentType: 'Stipulated Decision',
      },
      docketNumber: '101-18',
      docketNumberSuffix: DOCKET_NUMBER_SUFFIXES.SMALL,
      messages: [
        {
          createdAt: '2018-12-27T18:06:02.968Z',
          from: 'Test Respondent',
          fromUserId: '6805d1ab-18d0-43ec-bafb-654e83405416',
          message:
            'Stipulated Decision filed by respondent is ready for review',
          messageId: '343f5b21-a3a9-4657-8e2b-df782f920e45',
          to: null,
          userId: 'irsPractitioner',
        },
      ],
      section: DOCKET_SECTION,
      sentBy: 'irsPractitioner',
      updatedAt: '2018-12-27T18:06:02.968Z',
      workItemId: '78de1ba3-add3-4329-8372-ce37bda6bc93',
    };

    getUserById.mockReturnValue({
      ...mockDocketClerkUser,
      section: DOCKET_SECTION,
    });

    getWorkItemById.mockReturnValue(new WorkItem(mockWorkItem));
  });

  it('should throw an unauthorized error when the user does not have permission to assign work items', async () => {
    await expect(
      assignWorkItemsInteractor(options, mockDocketClerkUser),
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
      assignWorkItemsInteractor(options, mockDocketClerkUser),
    ).rejects.toThrow();
  });

  it('should throw an error when not given work item or work item id', async () => {
    await expect(
      assignWorkItemsInteractor(
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
    getUserById
      .mockReturnValueOnce(caseServicesSupervisorUser)
      .mockReturnValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      });

    await assignWorkItemsInteractor(
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
