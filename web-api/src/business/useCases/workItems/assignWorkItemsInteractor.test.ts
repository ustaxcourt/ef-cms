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
import { getWorkItemById as getWorkItemByIdMock } from '@web-api/persistence/postgres/workitems/getWorkItemById';
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

describe('assignWorkItemsInteractor', () => {
  const getUserById = jest.mocked(getUserByIdMock);
  const upsertWorkItems = upsertWorkItemsMock as jest.Mock;
  const getWorkItemById = getWorkItemByIdMock as jest.Mock;
  const getDocketEntriesByDocketNumberAndDocketEntryId = jest.mocked(
    getDocketEntriesByDocketNumberAndDocketEntryIdMock,
  );

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

    getUserById.mockResolvedValue({
      ...mockDocketClerkUser,
      section: DOCKET_SECTION,
    } as DbUser);

    getWorkItemById.mockResolvedValue(new WorkItem(mockWorkItem));
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
    getWorkItemById.mockResolvedValue(
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

  it('should assign work item to current docket clerk user when given work item', async () => {
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

  it('should assign work item to current petitions clerk user when given work item', async () => {
    getUserById.mockResolvedValue({
      ...mockPetitionsClerkUser,
      section: PETITIONS_SECTION,
    } as DbUser);
    await assignWorkItemsInteractor(
      applicationContext,
      {
        assigneeId: mockPetitionsClerkUser.userId,
        assigneeName: mockPetitionsClerkUser.name,
        workItem: mockWorkItem,
        workItemId: undefined,
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
    getUserById.mockResolvedValue({
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
        workItemId: undefined,
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
    getUserById.mockResolvedValue({
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
        workItemId: undefined,
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
    getUserById.mockResolvedValue({
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
        workItemId: undefined,
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

  it  ('should assign work item for a non-petition docket entry to the petitions section when filed by clerk of the court', async () => {
    getUserById.mockResolvedValue({
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
        workItemId: undefined,
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
