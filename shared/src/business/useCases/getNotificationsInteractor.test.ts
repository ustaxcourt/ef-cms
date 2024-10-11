import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  ADC_SECTION,
  CHAMBERS_SECTION,
  CHIEF_JUDGE,
  DOCKET_SECTION,
  PETITIONS_SECTION,
  ROLES,
} from '../entities/EntityConstants';
import { applicationContext } from '../test/createTestApplicationContext';
import { caseServicesSupervisorUser } from '../../test/mockUsers';
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
    caseIsInProgress: false,
    docketEntry: {
      isFileAttached: true,
    },
    isRead: true,
    section: DOCKET_SECTION,
  },
  {
    associatedJudge: 'Judge Carey',
    caseIsInProgress: false,
    docketEntry: {
      isFileAttached: true,
    },
    isRead: true,
    section: DOCKET_SECTION,
  },
  {
    associatedJudge: CHIEF_JUDGE,
    caseIsInProgress: false,
    docketEntry: {
      isFileAttached: true,
    },
    isRead: true,
    section: PETITIONS_SECTION,
  },
  {
    associatedJudge: 'Judge Barker',
    caseIsInProgress: false,
    docketEntry: {
      isFileAttached: true,
    },
    isRead: true,
    section: DOCKET_SECTION,
  },
  {
    associatedJudge: 'Judge Barker',
    caseIsInProgress: true,
    docketEntry: {
      isFileAttached: false,
    },
    inProgress: true,
    isRead: true,
    section: DOCKET_SECTION,
  },
  {
    associatedJudge: 'Judge Barker',
    caseIsInProgress: false,
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

  it('returns an unread count for my messages', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });
    getDocumentQCInboxForUser.mockReturnValue([
      {
        assigneeId: mockDocketClerkUser.userId,
        caseIsInProgress: false,
        docketEntry: { isFileAttached: true },
        isRead: true,
        section: DOCKET_SECTION,
      },
    ]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {} as any,
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
      {} as any,
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
      {} as any,
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
      {} as any,
      mockDocketClerkUser,
    );

    expect(result.qcUnreadCount).toEqual(1);
  });

  it('returns the qcIndividualInProgressCount for qc individual items with caseIsInProgress true, isFileAttached true and a judgeUserId supplied', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });
    getDocumentQCInboxForUser.mockReturnValue([
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        caseIsInProgress: true,
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
        caseIsInProgress: true,
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
        caseIsInProgress: false,
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
        caseServicesSupervisorData: undefined,
        judgeUserId: mockJudgeUser.userId,
      },
      mockDocketClerkUser,
    );

    expect(result.qcIndividualInProgressCount).toEqual(1);
  });

  it('returns the qcIndividualInboxCount for qc individual items with caseIsInProgress false, isFileAttached true and a judgeUserId supplied', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });
    getDocumentQCInboxForUser.mockReturnValue([
      {
        assigneeId: mockDocketClerkUser.userId,
        associatedJudge: 'Judge Barker',
        caseIsInProgress: false,
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
        caseIsInProgress: false,
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
        caseIsInProgress: true,
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
        caseServicesSupervisorData: undefined,
        judgeUserId: mockJudgeUser.userId,
      },
      mockDocketClerkUser,
    );

    expect(result.qcIndividualInboxCount).toEqual(1);
  });

  it('returns the qcSectionInProgressCount for qc section items with caseIsInProgress true, isFileAttached true and a judgeUserId supplied', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });
    getDocumentQCInboxForSection.mockReturnValue([
      {
        associatedJudge: 'Judge Barker',
        caseIsInProgress: false,
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        caseIsInProgress: true,
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: true,
        isRead: true,
        section: PETITIONS_SECTION,
      },
      {
        associatedJudge: 'Some Judge',
        caseIsInProgress: false,
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
        caseIsInProgress: true,
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: true,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Some Judge',
        caseIsInProgress: true,
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
        caseServicesSupervisorData: undefined,
        judgeUserId: mockJudgeUser.userId,
      },
      mockDocketClerkUser,
    );

    expect(result.qcSectionInProgressCount).toEqual(2);
  });

  it('returns the qcSectionInboxCount for qc section items with caseIsInProgress true, isFileAttached true and a judgeUserId supplied', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });
    getDocumentQCInboxForSection.mockReturnValue([
      {
        associatedJudge: 'Judge Barker',
        caseIsInProgress: false,
        docketEntry: {
          isFileAttached: true,
        },
        inProgress: false,
        isRead: true,
        section: DOCKET_SECTION,
      },
      {
        associatedJudge: 'Judge Barker',
        caseIsInProgress: true,
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
        caseServicesSupervisorData: undefined,
        judgeUserId: mockJudgeUser.userId,
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
        caseServicesSupervisorData: undefined,
        judgeUserId: 'docketclerk',
      },
      mockDocketClerkUser,
    );

    expect(result).toMatchObject({
      userInboxCount: 2,
    });
  });

  it('should fetch the qc section items for the provided judgeUserId', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      name: 'Some Judge',
      role: ROLES.judge,
      section: CHAMBERS_SECTION,
      userId: mockJudgeUser.userId,
    });

    await getNotificationsInteractor(
      applicationContext,
      {
        caseServicesSupervisorData: undefined,
        judgeUserId: mockJudgeUser.userId,
      },
      mockDocketClerkUser,
    );

    expect(getDocumentQCInboxForSection.mock.calls[0][0]).toMatchObject({
      judgeUserName: 'Some Judge',
    });
  });

  it('should fetch the qc section items without a judgeName when a judgeUserId is not provided', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.docketClerk,
      section: DOCKET_SECTION,
      userId: mockDocketClerkUser.userId,
    });

    await getNotificationsInteractor(
      applicationContext,
      {} as any,
      mockDocketClerkUser,
    );

    expect(getDocumentQCInboxForSection.mock.calls[0][0]).toMatchObject({
      judgeUserName: null,
    });
  });

  it('should fetch the qc section items with judgeName of CHIEF_JUDGE when a judgeUserId is not provided and the user role is adc', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      role: ROLES.adc,
      section: ADC_SECTION,
      userId: mockAdcUser.userId,
    });

    await getNotificationsInteractor(
      applicationContext,
      {} as any,
      mockAdcUser,
    );

    expect(getDocumentQCInboxForSection.mock.calls[0][0]).toMatchObject({
      judgeUserName: CHIEF_JUDGE,
    });
  });

  it('should fetch messages for the filtered document QC inbox for the selected section when caseServicesSupervisorData is not empty', async () => {
    const filteredWorkItem = {
      associatedJudge: 'Judge Barker',
      caseIsInProgress: false,
      docketEntry: {
        isFileAttached: true,
      },
      inProgress: false,
      isRead: true,
      section: PETITIONS_SECTION,
    };
    const mockCaseServicesSupervisorData = {
      section: PETITIONS_SECTION,
      userId: caseServicesSupervisorUser.userId,
    };
    getDocumentQCInboxForSection.mockReturnValue([filteredWorkItem]);

    const result = await getNotificationsInteractor(
      applicationContext,
      {
        caseServicesSupervisorData: {
          section: PETITIONS_SECTION,
          userId: caseServicesSupervisorUser.userId,
        },
        judgeUserId: undefined,
      },
      mockAdcUser,
    );

    expect(getUserInboxMessages.mock.calls[0][0].userId).toEqual(
      caseServicesSupervisorUser.userId,
    );
    expect(getSectionInboxMessages.mock.calls[0][0].section).toEqual(
      PETITIONS_SECTION,
    );
    expect(getDocumentQCInboxForSection.mock.calls[0][0].section).toEqual(
      mockCaseServicesSupervisorData.section,
    );

    expect(result.qcSectionInboxCount).toEqual(1);
  });
});
