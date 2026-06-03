import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  getDocumentQCInboxCountsForSection as getDocumentQCInboxCountsForSectionMock,
  getDocumentQCInboxCountsForUser as getDocumentQCInboxCountsForUserMock,
} from '@web-api/persistence/postgres/workitems/getDocumentQCInboxCounts';
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
const getDocumentQCInboxCountsForUser =
  getDocumentQCInboxCountsForUserMock as jest.Mock;
const getDocumentQCInboxCountsForSection =
  getDocumentQCInboxCountsForSectionMock as jest.Mock;

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

    getDocumentQCInboxCountsForUser.mockReturnValue({
      inProgressCount: 0,
      inboxCount: 0,
      unreadCount: 0,
    });

    getDocumentQCInboxCountsForSection.mockReturnValue({
      inProgressCount: 0,
      inboxCount: 0,
    });
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
    getDocumentQCInboxCountsForUser.mockReturnValue({
      inProgressCount: 0,
      inboxCount: 1,
      unreadCount: 0,
    });

    getDocumentQCInboxCountsForSection.mockReturnValue({
      inProgressCount: 1,
      inboxCount: 3,
    });

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
    const result = await getNotificationsInteractor(
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
    const result = await getNotificationsInteractor(
      applicationContext,
      { judgeId: '123456', section: DOCKET_SECTION },
      mockDocketClerkUser,
    );

    expect(result.userSectionCount).toEqual(2);
  });

  it('returns an accurate unread count for legacy items marked complete', async () => {
    getDocumentQCInboxCountsForUser.mockReturnValue({
      inProgressCount: 0,
      inboxCount: 0,
      unreadCount: 1,
    });

    const result = await getNotificationsInteractor(
      applicationContext,
      { judgeId: '123456', section: DOCKET_SECTION },
      mockDocketClerkUser,
    );

    expect(result.qcUnreadCount).toEqual(1);
  });

  it('returns the qcIndividualInProgressCount for qc individual items with isFileAttached true and a judgeId supplied', async () => {
    getDocumentQCInboxCountsForUser.mockReturnValue({
      inProgressCount: 1,
      inboxCount: 2,
      unreadCount: 0,
    });

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
    getDocumentQCInboxCountsForUser.mockReturnValue({
      inProgressCount: 0,
      inboxCount: 1,
      unreadCount: 0,
    });

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

  it('returns the qcSectionInProgressCount for qc section items', async () => {
    getDocumentQCInboxCountsForSection.mockReturnValue({
      inProgressCount: 2,
      inboxCount: 0,
    });

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

  it('returns the qcSectionInboxCount for qc section items', async () => {
    getDocumentQCInboxCountsForSection.mockReturnValue({
      inProgressCount: 0,
      inboxCount: 1,
    });

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

  it('should pass the judgeId to the section count query', async () => {
    await getNotificationsInteractor(
      applicationContext,
      {
        judgeId: mockJudgeUser.userId,
        section: DOCKET_SECTION,
      },
      mockDocketClerkUser,
    );

    expect(
      getDocumentQCInboxCountsForSection.mock.calls[0][0],
    ).toMatchObject({
      judgeId: mockJudgeUser.userId,
    });
  });

  it('should pass undefined judgeId when no judgeId is provided', async () => {
    await getNotificationsInteractor(
      applicationContext,
      { judgeId: undefined, section: DOCKET_SECTION },
      mockDocketClerkUser,
    );

    expect(
      getDocumentQCInboxCountsForSection.mock.calls[0][0],
    ).toMatchObject({
      judgeId: undefined,
    });
  });

  it('should use the selected section for the section count query and messages', async () => {
    const SELECTED_SECTION = PETITIONS_SECTION;

    getDocumentQCInboxCountsForSection.mockReturnValue({
      inProgressCount: 0,
      inboxCount: 1,
    });

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
    expect(
      getDocumentQCInboxCountsForSection.mock.calls[0][0].section,
    ).toEqual(SELECTED_SECTION);

    expect(result.qcSectionInboxCount).toEqual(1);
  });
});
