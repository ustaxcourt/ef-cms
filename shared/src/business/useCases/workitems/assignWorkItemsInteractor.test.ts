import {
  CASE_STATUS_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  ROLES,
} from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { assignWorkItemsInteractor } from './assignWorkItemsInteractor';

describe('assignWorkItemsInteractor', () => {
  const options = { assigneeId: 'ss', assigneeName: 'ss', workItemId: '' };
  const mockUserId = 'ebb34e3f-8ac1-4ac2-bc22-265b80a2acb2';
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
  });

  it('should throw an unauthorized error when the user does not have permission to assign work items', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: 'baduser',
    });

    await expect(
      assignWorkItemsInteractor(applicationContext, options),
    ).rejects.toThrow();
  });

  it('should throw an error when the work item is invalid', async () => {
    applicationContext.getPersistenceGateway().getWorkItemById.mockReturnValue({
      ...mockWorkItem,
      docketNumber: undefined,
    });

    await expect(
      assignWorkItemsInteractor(applicationContext, options),
    ).rejects.toThrow();
  });

  it('assigns a work item to the current user', async () => {
    const mockDocketClerkUser = {
      name: 'Alex Docketclerk',
      role: ROLES.docketClerk,
      section: 'docket',
      userId: mockUserId,
    };

    applicationContext.getCurrentUser.mockReturnValue(mockDocketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockDocketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getWorkItemById.mockReturnValue(mockWorkItem);

    await assignWorkItemsInteractor(applicationContext, {
      assigneeId: mockUserId,
      assigneeName: 'Ted Docket',
      workItemId: mockWorkItem.workItemId,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem,
    ).toMatchObject({
      section: mockDocketClerkUser.section,
      sentBy: mockDocketClerkUser.name,
      sentBySection: mockDocketClerkUser.section,
      sentByUserId: mockDocketClerkUser.userId,
    });
  });
});
