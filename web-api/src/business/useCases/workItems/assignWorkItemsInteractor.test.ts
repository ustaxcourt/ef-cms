import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import {
  CASE_SERVICES_SUPERVISOR_SECTION,
  CLERK_OF_COURT_SECTION,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '@shared/business/entities/EntityConstants';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { assignWorkItemsInteractor } from './assignWorkItemsInteractor';
import { caseServicesSupervisorUser } from '@shared/test/mockUsers';
import { getWorkItemsByIds as getWorkItemsByIdsMock } from '@web-api/persistence/postgres/workitems/getWorkItemsByIds';
import {
  mockCaseServicesSupervisorUser,
  mockClerkOfTheCourtUser,
  mockDocketClerkUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { upsertWorkItems as upsertWorkItemsMock } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import { getDocketEntriesByDocketNumberAndDocketEntryId as getDocketEntriesByDocketNumberAndDocketEntryIdMock } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { getWorkItemsByDocketNumber as getWorkItemsByDocketNumberMock } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';

describe('assignWorkItemsInteractor', () => {
  const getUserById = jest.mocked(getUserByIdMock);
  const upsertWorkItems = upsertWorkItemsMock as jest.Mock;
  const getWorkItemsByIds = getWorkItemsByIdsMock as jest.Mock;
  const getDocketEntriesByDocketNumberAndDocketEntryId = jest.mocked(
    getDocketEntriesByDocketNumberAndDocketEntryIdMock,
  );
  const getWorkItemsByDocketNumber = jest.mocked(
    getWorkItemsByDocketNumberMock,
  );

  const options = { assigneeId: 'ss', assigneeName: 'ss', workItemIds: [''] };
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

    getUserById.mockResolvedValue({
      ...mockDocketClerkUser,
      section: DOCKET_SECTION,
    } as DbUser);

    getWorkItemsByIds.mockResolvedValue([new WorkItem(mockWorkItem)]);
    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
      {
        documentTitle: 'Some title',
      },
    ] as RawDocketEntry[]);
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
    getWorkItemsByIds.mockResolvedValue([
      new WorkItem({
        ...mockWorkItem,
        docketNumber: undefined,
      }),
    ]);

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
          workItemIds: undefined,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow();
  });

  it('should assign work item to current docket clerk user when given work item', async () => {
    getUserById
      .mockResolvedValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      } as DbUser)
      .mockResolvedValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      } as DbUser);

    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockDocketClerkUser.userId,
        assigneeName: 'Ted Docket',
        workItem: mockWorkItem,
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

  it('should assign work item to current petitions clerk user when given work item', async () => {
    getUserById
      .mockResolvedValueOnce({
        ...mockPetitionsClerkUser,
        section: PETITIONS_SECTION,
      } as DbUser)
      .mockResolvedValueOnce({
        ...mockPetitionsClerkUser,
        section: PETITIONS_SECTION,
      } as DbUser);

    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockPetitionsClerkUser.userId,
        assigneeName: mockPetitionsClerkUser.name,
        workItem: mockWorkItem,
      },
      mockPetitionsClerkUser,
    );
    await expect(upsertWorkItems.mock.calls[0][0].workItems).toMatchObject([
      {
        section: PETITIONS_SECTION,
        sentBy: mockPetitionsClerkUser.name,
        sentBySection: PETITIONS_SECTION,
        sentByUserId: mockPetitionsClerkUser.userId,
      },
    ]);
  });

  it('should assign work item for a petition docket entry to the petitions section when filed by case services supervisor', async () => {
    getUserById
      .mockResolvedValueOnce({
        ...mockCaseServicesSupervisorUser,
        section: CASE_SERVICES_SUPERVISOR_SECTION,
      } as DbUser)
      .mockResolvedValueOnce({
        ...mockCaseServicesSupervisorUser,
        section: CASE_SERVICES_SUPERVISOR_SECTION,
      } as DbUser);

    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
      { documentTitle: 'Petition' },
    ] as RawDocketEntry[]);
    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockCaseServicesSupervisorUser.userId,
        assigneeName: mockCaseServicesSupervisorUser.name,
        workItem: mockWorkItem,
      },
      mockCaseServicesSupervisorUser,
    );
    await expect(upsertWorkItems.mock.calls[0][0].workItems).toMatchObject([
      {
        section: PETITIONS_SECTION,
        sentBy: mockCaseServicesSupervisorUser.name,
        sentBySection: CASE_SERVICES_SUPERVISOR_SECTION,
        sentByUserId: mockCaseServicesSupervisorUser.userId,
      },
    ]);
  });

  it('should assign work item for a petition docket entry to the petitions section when filed by clerk of the court', async () => {
    getUserById
      .mockResolvedValueOnce({
        ...mockClerkOfTheCourtUser,
        section: CLERK_OF_COURT_SECTION,
      } as DbUser)
      .mockResolvedValueOnce({
        ...mockClerkOfTheCourtUser,
        section: CLERK_OF_COURT_SECTION,
      } as DbUser);

    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
      { documentTitle: 'Petition' },
    ] as RawDocketEntry[]);
    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockClerkOfTheCourtUser.userId,
        assigneeName: mockClerkOfTheCourtUser.name,
        workItem: mockWorkItem,
      },
      mockClerkOfTheCourtUser,
    );
    await expect(upsertWorkItems.mock.calls[0][0].workItems).toMatchObject([
      {
        section: PETITIONS_SECTION,
        sentBy: mockClerkOfTheCourtUser.name,
        sentBySection: CLERK_OF_COURT_SECTION,
        sentByUserId: mockClerkOfTheCourtUser.userId,
      },
    ]);
  });

  it('should assign work item for a non-petition docket entry to the petitions section when filed by case services supervisor', async () => {
    getUserById
      .mockResolvedValueOnce({
        ...mockCaseServicesSupervisorUser,
        section: CASE_SERVICES_SUPERVISOR_SECTION,
      } as DbUser)
      .mockResolvedValueOnce({
        ...mockCaseServicesSupervisorUser,
        section: CASE_SERVICES_SUPERVISOR_SECTION,
      } as DbUser);

    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
      { documentTitle: 'Something' },
    ] as RawDocketEntry[]);
    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockCaseServicesSupervisorUser.userId,
        assigneeName: mockCaseServicesSupervisorUser.name,
        workItem: mockWorkItem,
      },
      mockCaseServicesSupervisorUser,
    );
    await expect(upsertWorkItems.mock.calls[0][0].workItems).toMatchObject([
      {
        section: DOCKET_SECTION,
        sentBy: mockCaseServicesSupervisorUser.name,
        sentBySection: CASE_SERVICES_SUPERVISOR_SECTION,
        sentByUserId: mockCaseServicesSupervisorUser.userId,
      },
    ]);
  });

  it('should assign work item for a non-petition docket entry to the petitions section when filed by clerk of the court', async () => {
    getUserById
      .mockResolvedValueOnce({
        ...mockClerkOfTheCourtUser,
        section: CLERK_OF_COURT_SECTION,
      } as DbUser)
      .mockResolvedValueOnce({
        ...mockClerkOfTheCourtUser,
        section: CLERK_OF_COURT_SECTION,
      } as DbUser);

    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
      { documentTitle: 'Something' },
    ] as RawDocketEntry[]);
    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockClerkOfTheCourtUser.userId,
        assigneeName: mockClerkOfTheCourtUser.name,
        workItem: mockWorkItem,
      },
      mockClerkOfTheCourtUser,
    );
    await expect(upsertWorkItems.mock.calls[0][0].workItems).toMatchObject([
      {
        section: DOCKET_SECTION,
        sentBy: mockClerkOfTheCourtUser.name,
        sentBySection: CLERK_OF_COURT_SECTION,
        sentByUserId: mockClerkOfTheCourtUser.userId,
      },
    ]);
  });

  it('assigns a work item to a user with their original section value when the person making the assignment is a case services user', async () => {
    getUserById
      .mockResolvedValueOnce(caseServicesSupervisorUser as DbUser)
      .mockResolvedValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      } as DbUser);

    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockDocketClerkUser.userId,
        assigneeName: 'Ted Docket',
        workItemIds: [mockWorkItem.workItemId],
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

  it('should assign work items for all member cases in a consolidated group when the lead case work item is assigned', async () => {
    const leadDocketNumber = '101-18';
    const memberDocketNumber1 = '102-18';
    const memberDocketNumber2 = '103-18';
    const sharedDocketEntryId = 'b6238482-5f0e-48a8-bb8e-da2957074a08';

    const leadWorkItem: RawWorkItem = {
      ...mockWorkItem,
      docketNumber: leadDocketNumber,
      leadDocketNumber,
      docketEntryId: sharedDocketEntryId,
    };

    const memberWorkItem1 = new WorkItem({
      assigneeId: '03b74100-10ac-45f1-865d-b063978cac9c',
      assigneeName: 'bob',
      createdAt: '2018-12-27T18:06:02.971Z',
      docketEntryId: sharedDocketEntryId,
      docketNumber: memberDocketNumber1,
      leadDocketNumber,
      section: DOCKET_SECTION,
      sentBy: 'irsPractitioner',
      updatedAt: '2018-12-27T18:06:02.968Z',
      workItemId: 'a1b74100-10ac-45f1-865d-b063978cac9c',
    });

    const memberWorkItem2 = new WorkItem({
      assigneeId: '03b74100-10ac-45f1-865d-b063978cac9c',
      assigneeName: 'bob',
      createdAt: '2018-12-27T18:06:02.971Z',
      docketEntryId: sharedDocketEntryId,
      docketNumber: memberDocketNumber2,
      leadDocketNumber,
      section: DOCKET_SECTION,
      sentBy: 'irsPractitioner',
      updatedAt: '2018-12-27T18:06:02.968Z',
      workItemId: 'b2b74100-10ac-45f1-865d-b063978cac9c',
    });

    getWorkItemsByDocketNumber.mockResolvedValue([
      memberWorkItem1,
      memberWorkItem2,
      new WorkItem({
        ...mockWorkItem,
        docketNumber: memberDocketNumber1,
        docketEntryId: 'c3b74100-10ac-45f1-865d-b063978cac9c',
        workItemId: 'd4b74100-10ac-45f1-865d-b063978cac9c',
      }),
    ]);

    getUserById
      .mockResolvedValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      } as DbUser)
      .mockResolvedValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      } as DbUser);

    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockDocketClerkUser.userId,
        assigneeName: 'Ted Docket',
        workItem: leadWorkItem,
      },
      mockDocketClerkUser,
    );

    expect(getWorkItemsByDocketNumber).toHaveBeenCalledWith({
      docketNumber: leadDocketNumber,
    });

    expect(upsertWorkItems.mock.calls[0][0].workItems).toHaveLength(3);

    expect(upsertWorkItems.mock.calls[0][0].workItems).toMatchObject([
      {
        docketNumber: leadDocketNumber,
        assigneeId: mockDocketClerkUser.userId,
        assigneeName: 'Ted Docket',
        section: DOCKET_SECTION,
        sentBy: mockDocketClerkUser.name,
        sentBySection: DOCKET_SECTION,
        sentByUserId: mockDocketClerkUser.userId,
      },
      {
        docketNumber: memberDocketNumber1,
        assigneeId: mockDocketClerkUser.userId,
        assigneeName: 'Ted Docket',
        section: DOCKET_SECTION,
        sentBy: mockDocketClerkUser.name,
        sentBySection: DOCKET_SECTION,
        sentByUserId: mockDocketClerkUser.userId,
      },
      {
        docketNumber: memberDocketNumber2,
        assigneeId: mockDocketClerkUser.userId,
        assigneeName: 'Ted Docket',
        section: DOCKET_SECTION,
        sentBy: mockDocketClerkUser.name,
        sentBySection: DOCKET_SECTION,
        sentByUserId: mockDocketClerkUser.userId,
      },
    ]);
  });

  it('should not assign member work items when the work item is not the lead case', async () => {
    const leadDocketNumber = '101-18';
    const memberDocketNumber = '102-18';

    const memberWorkItem: RawWorkItem = {
      ...mockWorkItem,
      docketNumber: memberDocketNumber,
      leadDocketNumber,
    };

    getUserById
      .mockResolvedValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      } as DbUser)
      .mockResolvedValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      } as DbUser);

    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockDocketClerkUser.userId,
        assigneeName: 'Ted Docket',
        workItem: memberWorkItem,
      },
      mockDocketClerkUser,
    );

    expect(getWorkItemsByDocketNumber).not.toHaveBeenCalled();

    expect(upsertWorkItems.mock.calls[0][0].workItems).toHaveLength(1);
    expect(upsertWorkItems.mock.calls[0][0].workItems).toMatchObject([
      {
        docketNumber: memberDocketNumber,
        assigneeId: mockDocketClerkUser.userId,
        assigneeName: 'Ted Docket',
      },
    ]);
  });

  it('should throw an error when the current user is not found', async () => {
    getUserById.mockResolvedValueOnce(undefined);

    await expect(
      assignWorkItemsInteractor(
        applicationContext,
        {
          assigneeId: mockDocketClerkUser.userId,
          assigneeName: 'Ted Docket',
          workItemIds: [mockWorkItem.workItemId],
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('User not found with user id');
  });

  it('should throw an error when the user being assigned is not found', async () => {
    getUserById
      .mockResolvedValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      } as DbUser)
      .mockResolvedValueOnce(undefined);

    await expect(
      assignWorkItemsInteractor(
        applicationContext,
        {
          assigneeId: 'unknown-user-id',
          assigneeName: 'Unknown User',
          workItemIds: [mockWorkItem.workItemId],
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('User not found with user id unknown-user-id');
  });

  it('should throw an error when work item is not found by workItemId', async () => {
    getUserById
      .mockResolvedValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      } as DbUser)
      .mockResolvedValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      } as DbUser);

    getWorkItemsByIds.mockResolvedValue([]);

    await expect(
      assignWorkItemsInteractor(
        applicationContext,
        {
          assigneeId: mockDocketClerkUser.userId,
          assigneeName: 'Ted Docket',
          workItemIds: ['non-existent-work-item-id'],
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('WorkItem non-existent-work-item-id was not found.');
  });

  it('should throw an error when docket entry associated with work item is not found', async () => {
    getUserById
      .mockResolvedValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      } as DbUser)
      .mockResolvedValueOnce({
        ...mockDocketClerkUser,
        section: DOCKET_SECTION,
      } as DbUser);

    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([]);

    await expect(
      assignWorkItemsInteractor(
        applicationContext,
        {
          assigneeId: mockDocketClerkUser.userId,
          assigneeName: 'Ted Docket',
          workItem: mockWorkItem,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Docket entry associated with work item');
  });
});
