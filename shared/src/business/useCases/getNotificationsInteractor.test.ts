import {
  CHIEF_JUDGE,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { applicationContext } from '../test/createTestApplicationContext';
import { getNotificationsInteractor } from './getNotificationsInteractor';

const mockWorkItems = {
  section: {
    inProgress: [
      {
        workItemId: 'work-item-id-1',
      },
      {
        workItemId: 'work-item-id-1',
      },
      {
        workItemId: 'work-item-id-1',
      },
      {
        workItemId: 'work-item-id-1',
      },
    ],
    inbox: [
      {
        isRead: true,
        workItemId: 'work-item-id-1',
      },
      {
        workItemId: 'work-item-id-1',
      },
      {
        workItemId: 'work-item-id-1',
      },
    ],
  },
  user: {
    inProgress: [
      {
        workItemId: 'work-item-id-1',
      },
      {
        workItemId: 'work-item-id-1',
      },
    ],
    inbox: [
      {
        isRead: true,
        workItemId: 'work-item-id-1',
      },
      {
        workItemId: 'work-item-id-1',
      },
    ],
  },
};

const mockMessages = {
  section: [
    {
      isRead: true,
      messageId: 'message-id-1',
    },
    {
      messageId: 'message-id-1',
    },
    {
      messageId: 'message-id-1',
    },
  ],
  user: [
    {
      isRead: true,
      messageId: 'message-id-1',
    },
    {
      messageId: 'message-id-1',
    },
  ],
};
let mockUser;

describe('getNotificationsInteractor', () => {
  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCForUser.mockImplementation(({ box }) => {
        return mockWorkItems.user[box];
      });

    applicationContext
      .getPersistenceGateway()
      .getDocumentQCForSection.mockImplementation(({ box }) => {
        return mockWorkItems.section[box];
      });

    applicationContext
      .getPersistenceGateway()
      .getUserInboxMessages.mockReturnValue(mockMessages.user);

    applicationContext
      .getPersistenceGateway()
      .getSectionInboxMessages.mockReturnValue(mockMessages.section);
    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
  });

  beforeEach(() => {
    mockUser = {
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    };
  });

  it('returns unauthorized if the user is not a Court user', async () => {
    mockUser.role = 'privatePractitioner';

    await expect(
      getNotificationsInteractor(
        applicationContext as unknown as ServerApplicationContext,
        {},
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('calls persistence methods to get the user and section inbox for messages', async () => {
    await getNotificationsInteractor(
      applicationContext as unknown as ServerApplicationContext,
      {} as any,
    );
    expect(
      applicationContext.getPersistenceGateway().getUserInboxMessages,
    ).toHaveBeenCalledWith(
      expect.objectContaining({ userId: mockUser.userId }),
    );
    expect(
      applicationContext.getPersistenceGateway().getSectionInboxMessages,
    ).toHaveBeenCalledWith(
      expect.objectContaining({ section: mockUser.section }),
    );
  });

  it('calls persistence methods to get the user and section inbox and inProgress for document qc', async () => {
    await getNotificationsInteractor(
      applicationContext as unknown as ServerApplicationContext,
      {} as any,
    );

    ['inbox', 'inProgress'].forEach(box => {
      expect(
        applicationContext.getPersistenceGateway().getDocumentQCForUser,
      ).toHaveBeenCalledWith(
        expect.objectContaining({ box, userId: mockUser.userId }),
      );

      expect(
        applicationContext.getPersistenceGateway().getDocumentQCForSection,
      ).toHaveBeenCalledWith(
        expect.objectContaining({ box: 'inbox', section: mockUser.section }),
      );
    });
  });

  it('returns the properly calculated counts based on what the persistence calls retreived', async () => {
    const result = await await getNotificationsInteractor(
      applicationContext as unknown as ServerApplicationContext,
      {} as any,
    );

    expect(result).toEqual({
      qcIndividualInProgressCount: mockWorkItems.user.inProgress.length,
      qcIndividualInboxCount: mockWorkItems.user.inbox.length,
      qcSectionInProgressCount: mockWorkItems.section.inProgress.length,
      qcSectionInboxCount: mockWorkItems.section.inbox.length,
      qcUnreadCount: mockWorkItems.user.inbox.filter(
        workItem => !workItem.isRead,
      ).length,
      unreadMessageCount: mockMessages.user.filter(message => !message.isRead)
        .length,
      userInboxCount: mockMessages.user.length,
      userSectionCount: mockMessages.section.length,
    });
  });

  it('should fetch the qc section items for the provided judgeUserId', async () => {
    await getNotificationsInteractor(
      applicationContext as unknown as ServerApplicationContext,
      {
        caseServicesSupervisorData: undefined,
        judgeUserId: 'ee577e31-d6d5-4c4a-adc6-520075f3dde5',
      },
    );

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCForSection.mock
        .calls[0][0],
    ).toMatchObject({
      judgeUserId: 'ee577e31-d6d5-4c4a-adc6-520075f3dde5',
      judgeUserName: undefined,
    });
  });

  it('should fetch the qc section items without a judgeName when a judgeUserId is not provided', async () => {
    await getNotificationsInteractor(
      applicationContext as unknown as ServerApplicationContext,
      {} as any,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCForSection.mock
        .calls[0][0],
    ).toMatchObject({
      judgeUserId: undefined,
      judgeUserName: undefined,
    });
  });

  it('should fetch the qc section items with judgeName of CHIEF_JUDGE when a judgeUserId is not provided and the user role is adc', async () => {
    mockUser.role = ROLES.adc;

    await getNotificationsInteractor(
      applicationContext as unknown as ServerApplicationContext,
      {} as any,
    );

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCForSection.mock
        .calls[0][0],
    ).toMatchObject({
      judgeUserId: undefined,
      judgeUserName: CHIEF_JUDGE,
    });
  });

  it('should fetch messages for the selected section when caseServicesSupervisorData is not empty', async () => {
    mockUser.role = ROLES.caseServicesSupervisor;

    const mockCaseServicesSupervisorData = {
      section: PETITIONS_SECTION,
      userId: 'aaaaaaaa-810c-4440-9189-bb6bfea413fd',
    };

    await getNotificationsInteractor(
      applicationContext as unknown as ServerApplicationContext,
      {
        caseServicesSupervisorData: {
          ...mockCaseServicesSupervisorData,
        },
      },
    );

    expect(
      applicationContext.getPersistenceGateway().getUserInboxMessages,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockCaseServicesSupervisorData.userId,
      }),
    );
    expect(
      applicationContext.getPersistenceGateway().getSectionInboxMessages,
    ).toHaveBeenCalledWith(
      expect.objectContaining({ section: PETITIONS_SECTION }),
    );

    expect(
      applicationContext.getPersistenceGateway().getDocumentQCForUser,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        box: 'inbox',
        userId: mockCaseServicesSupervisorData.userId,
      }),
    );
    expect(
      applicationContext.getPersistenceGateway().getDocumentQCForUser,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        box: 'inProgress',
        userId: mockCaseServicesSupervisorData.userId,
      }),
    );
    expect(
      applicationContext.getPersistenceGateway().getDocumentQCForSection,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        box: 'inbox',
        section: PETITIONS_SECTION,
      }),
    );
    expect(
      applicationContext.getPersistenceGateway().getDocumentQCForSection,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        box: 'inProgress',
        section: PETITIONS_SECTION,
      }),
    );
  });
});
