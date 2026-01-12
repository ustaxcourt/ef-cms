import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  CASE_STATUS_TYPES,
  CHAMBERS_SECTION,
  CHIEF_JUDGE,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { getDocumentQCInboxForSection as getDocumentQCInboxForSectionMock } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForSection';
import { getDocumentQCInboxForUser as getDocumentQCInboxForUserMock } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';
import { getNotificationsInteractor } from './getNotificationsInteractor';
import { getSectionInboxMessages as getSectionInboxMessagesMock } from '@web-api/persistence/postgres/messages/getSectionInboxMessages';
import { getUserInboxMessages as getUserInboxMessagesMock } from '@web-api/persistence/postgres/messages/getUserInboxMessages';
import {
  mockAdcUser,
  mockDocketClerkUser,
  mockJudgeUser,
} from '@shared/test/mockAuthUsers';

const getUserInboxMessages = getUserInboxMessagesMock as jest.Mock;
const getSectionInboxMessages = getSectionInboxMessagesMock as jest.Mock;
const getDocumentQCInboxForUser = getDocumentQCInboxForUserMock as jest.Mock;
const getDocumentQCInboxForSection =
  getDocumentQCInboxForSectionMock as jest.Mock;

const workItems = [
  {
    associatedJudge: 'Judge Barker',
    docketEntry: {
      isFileAttached: true,
    },
    isRead: true,
    section: DOCKET_SECTION,
  },
  {
    associatedJudge: 'Judge Carey',
    docketEntry: {
      isFileAttached: true,
    },
    isRead: true,
    section: DOCKET_SECTION,
  },
  {
    associatedJudge: CHIEF_JUDGE,
    docketEntry: {
      isFileAttached: true,
    },
    isRead: true,
    section: PETITIONS_SECTION,
  },
  {
    associatedJudge: 'Judge Barker',
    docketEntry: {
      isFileAttached: true,
    },
    isRead: true,
    section: DOCKET_SECTION,
  },
  {
    associatedJudge: 'Judge Barker',
    docketEntry: {
      isFileAttached: false,
    },
    inProgress: true,
    isRead: true,
    section: DOCKET_SECTION,
  },
  {
    associatedJudge: 'Judge Barker',
    docketEntry: {
      isFileAttached: false,
    },
    isRead: true,
    section: PETITIONS_SECTION,
  },
];

describe('getNotificationsInteractor', () => {
  beforeEach(() => {
    getUserInboxMessages.mockReturnValue([
      {
        isRead: true,
        messageId: 'message-id-1',
      },
    ]);

    getSectionInboxMessages.mockReturnValue([
      {
        messageId: 'message-id-1',
      },
      {
        messageId: 'message-id-2',
      },
    ]);

    getDocumentQCInboxForSection.mockReturnValue(workItems);

    getDocumentQCInboxForUser.mockReturnValue([
      ...workItems,
      { ...workItems[0], isRead: false },
    ]);
  });

  it('should throw an error when the user does not have permission to get notifications', async () => {
    await expect(
      getNotificationsInteractor(
        applicationContext,
        {
          judgeId: '123456',
          section: DOCKET_SECTION,
        },
        undefined,
      ),
    ).rejects.toThrow();
  });

  it('returns an unread count for my messages', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });
    getDocumentQCInboxForUser.mockReturnValue([
      {
        assigneeId: mockDocketClerkUser.userId,
        docketEntry: { isFileAttached: true },
        isRead: true,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: '123456',
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result).toEqual({
      qcIndividualInProgressCount: 0,
      qcIndividualInboxCount: 1,
      qcSectionInProgressCount: 1,
      qcSectionInboxCount: 3,
      qcUnreadCount: 0,
      unreadMessageCount: 0,
      userInboxCount: 1,
      userSectionCount: 2,
    });
  });

  it('returns the total user inbox count', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });

    const result = await await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: '123456',
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.userInboxCount).toEqual(1);
  });

  it('returns the total section messages count', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });

    const result = await await getNotificationsInteractor(
      applicationContext,
      { judgeId: '123456', section: DOCKET_SECTION },
      mockDocketClerkUser,
    );

    expect(result.userSectionCount).toEqual(2);
  });

  it('returns an accurate unread count for legacy items marked complete', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });

    const result = await getNotificationsInteractor(
      applicationContext,
      { judgeId: '123456', section: DOCKET_SECTION },
      mockDocketClerkUser,
    );

    expect(result.qcUnreadCount).toEqual(1);
  });

  it('returns the qcIndividualInProgressCount for qc individual items with isFileAttached true and a judgeId supplied', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });
    getDocumentQCInboxForUser.mockReturnValue([
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: true,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcIndividualInProgressCount).toEqual(1);
  });

  it('returns the qcIndividualInboxCount for qc individual items with isFileAttached true and a judgeId supplied', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });
    getDocumentQCInboxForUser.mockReturnValue([
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: false,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: true,
        isRead: true,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcIndividualInboxCount).toEqual(1);
  });

  it('returns the qcSectionInProgressCount for qc section items with isFileAttached true and a judgeId supplied', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });
    getDocumentQCInboxForSection.mockReturnValue([
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: true,
        isRead: true,
        section: PETITIONS_SECTION,
      },
      {
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: true,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Some Judge',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: true,
        isRead: true,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcSectionInProgressCount).toEqual(2);
  });

  it('returns the qcSectionInboxCount for qc section items with isFileAttached true and a judgeId supplied', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });
    getDocumentQCInboxForSection.mockReturnValue([
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: true,
        isRead: true,
        section: PETITIONS_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result.qcSectionInboxCount).toEqual(1);
  });

  it('returns an accurate unread count for my messages', async () => {
    getUserInboxMessages.mockReturnValue([
      {
        isRead: false,
        messageId: 'message-id-1',
      },
      {
        isRead: true,
        messageId: 'message-id-2',
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: '890809',
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(result).toMatchObject({
      userInboxCount: 2,
    });
  });

  it('should fetch the qc section items for the provided judgeId', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      name: 'Some Judge',
      role: ROLES.judge,
      section: CHAMBERS_SECTION,
      userId: mockJudgeUser.userId,
    });

    await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(getDocumentQCInboxForSection.mock.calls[0][0]).toMatchObject({
      judgeId: mockJudgeUser.userId,
    });
  });

  it('should fetch the qc section items without a judgeId when a judgeId is not provided', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });

    await getNotificationsInteractor(
      applicationContext,
      { judgeId: undefined, section: DOCKET_SECTION },
      mockDocketClerkUser,
    );

    expect(getDocumentQCInboxForSection.mock.calls[0][0]).toMatchObject({
      judgeId: undefined,
    });
  });

  it('should fetch messages for the filtered document QC inbox for the selected section when a selected section is specified', async () => {
    const filteredWorkItem = {
      associatedJudge: 'Judge Barker',
      docketEntry: {
        isFileAttached: true,
      },
      inProgress: false,
      isRead: true,
      section: PETITIONS_SECTION,
      caseStatus: CASE_STATUS_TYPES.new,
    };
    const SELECTED_SECTION = PETITIONS_SECTION;

    getDocumentQCInboxForSection.mockReturnValue([filteredWorkItem]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        selectedSection: SELECTED_SECTION,
        section: DOCKET_SECTION,
        judgeId: undefined,
      },
      mockAdcUser,
    );

    expect(getUserInboxMessages.mock.calls[0][0].userId).toEqual(
      mockAdcUser.userId,
    );
    expect(getSectionInboxMessages.mock.calls[0][0].section).toEqual(
      SELECTED_SECTION,
    );
    expect(getDocumentQCInboxForSection.mock.calls[0][0].section).toEqual(
      SELECTED_SECTION,
    );

    expect(result.qcSectionInboxCount).toEqual(1);
  });
});
