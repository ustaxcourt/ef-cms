const { applicationContext } = require('../test/createTestApplicationContext');
const { CHIEF_JUDGE, ROLES } = require('../entities/EntityConstants');
const { getNotificationsInteractor } = require('./getNotificationsInteractor');

const workItems = [
  {
    associatedJudge: 'Judge Barker',
    caseIsInProgress: false,
    docketEntry: {
      isFileAttached: true,
    },
    isRead: true,
  },
  {
    associatedJudge: 'Judge Carey',
    caseIsInProgress: false,
    docketEntry: {
      isFileAttached: true,
    },
    isRead: true,
  },
  {
    associatedJudge: CHIEF_JUDGE,
    caseIsInProgress: false,
    docketEntry: {
      isFileAttached: true,
    },
    isRead: true,
  },
  {
    associatedJudge: 'Judge Barker',
    caseIsInProgress: true,
    docketEntry: {
      isFileAttached: true,
    },
    isRead: true,
  },
  {
    associatedJudge: 'Judge Barker',
    caseIsInProgress: false,
    docketEntry: {
      isFileAttached: false,
    },
    isRead: true,
  },
];

describe('getNotificationsInteractor', () => {
  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserInboxMessages.mockReturnValue([
        {
          messageId: 'message-id-1',
        },
      ]);

    applicationContext
      .getUtilities()
      .filterQcItemsByAssociatedJudge.mockReturnValue(() => true);

    applicationContext
      .getPersistenceGateway()
      .getSectionInboxMessages.mockReturnValue([
        {
          messageId: 'message-id-1',
        },
        {
          messageId: 'message-id-2',
        },
      ]);

    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForSection.mockReturnValue(workItems);

    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([
        ...workItems,
        { ...workItems[0], isRead: false },
      ]);

    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    });
  });

  it('fails due to being unauthorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitioner,
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    });

    await expect(
      getNotificationsInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('Unauthorized to get inbox counts');
  });

  it('returns an unread count for my messages', async () => {
    applicationContext
      .getPersistenceGateway()
      .getDocumentQCInboxForUser.mockReturnValue([
        {
          docketEntry: { isFileAttached: true },
          isRead: true,
        },
      ]);

    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });
    expect(result).toEqual({
      qcIndividualInProgressCount: 0,
      qcIndividualInboxCount: 1,
      qcSectionInProgressCount: 1,
      qcSectionInboxCount: 3,
      qcUnreadCount: 0,
      userInboxCount: 1,
      userSectionCount: 2,
    });
  });

  it('returns the total user inbox count', async () => {
    const result = await await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });

    expect(result.userInboxCount).toEqual(1);
  });

  it('returns the total section messages count', async () => {
    const result = await await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });

    expect(result.userSectionCount).toEqual(2);
  });

  it('returns an accurate unread count for legacy items marked complete', async () => {
    const result = await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });

    expect(result.qcUnreadCount).toEqual(1);
  });

  it('returns the qcIndividualInProgressCount for qc individual items with caseIsInProgress true, isFileAttached true and judge filter true', async () => {
    const result = await await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });

    expect(result.qcIndividualInProgressCount).toEqual(1);
  });

  it('returns the qcIndividualInboxCount for qc individual items with caseIsInProgress false, isFileAttached true andjudge filter true', async () => {
    const result = await await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });

    expect(result.qcIndividualInboxCount).toEqual(4);
  });

  it('returns the qcSectionInProgressCount for qc section items with caseIsInProgress true, isFileAttached true andjudge filter true', async () => {
    const result = await await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });

    expect(result.qcSectionInProgressCount).toEqual(1);
  });

  it('returns the qcSectionInboxCount for qc section items with caseIsInProgress true, isFileAttached true andjudge filter true', async () => {
    const result = await await getNotificationsInteractor({
      applicationContext,
      userId: 'docketclerk',
    });

    expect(result.qcSectionInboxCount).toEqual(3);
  });
});
