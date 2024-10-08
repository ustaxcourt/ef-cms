import {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { assignWorkItemsInteractor } from './assignWorkItemsInteractor';
import { caseServicesSupervisorUser } from '../../../../../shared/src/test/mockUsers';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { saveWorkItem as saveWorkItemMock } from '@web-api/persistence/postgres/workitems/saveWorkItem';

describe('assignWorkItemsInteractor', () => {
  const saveWorkItem = saveWorkItemMock as jest.Mock;
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

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      ...mockDocketClerkUser,
      section: DOCKET_SECTION,
    });

    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockReturnValue(mockWorkItem);
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
    applicationContext.getPersistenceGateway().getWorkItemById.mockReturnValue({
      ...mockWorkItem,
      docketNumber: undefined,
    });

    await expect(
      assignWorkItemsInteractor(
        applicationContext,
        options,
        mockDocketClerkUser,
      ),
    ).rejects.toThrow();
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

    expect(saveWorkItem.mock.calls[0][0].workItem).toMatchObject({
      section: DOCKET_SECTION,
      sentBy: mockDocketClerkUser.name,
      sentBySection: DOCKET_SECTION,
      sentByUserId: mockDocketClerkUser.userId,
    });
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

    expect(saveWorkItem.mock.calls[0][0].workItem).toMatchObject({
      section: DOCKET_SECTION,
      sentBy: caseServicesSupervisorUser.name,
      sentBySection: caseServicesSupervisorUser.section,
      sentByUserId: caseServicesSupervisorUser.userId,
    });
  });
});
